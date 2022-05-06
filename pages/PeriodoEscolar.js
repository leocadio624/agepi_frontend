import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';
import {Modal, Button} from 'react-bootstrap';

import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import create_file from '../assetss/images/create-file.png';

import search from '../assetss/images/search.png';
import save from '../assetss/images/save-file.png';
import cancelar from '../assetss/images/cancelar.png';
import limpiar from '../assetss/images/iconoBorrar.png';



const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterignPage(){
    const auth = useAuth();
    const [show, setShow] = useState(false);
    const cat_anio = useRef();
    const cat_periodo = useRef();

    const [estado, setEstado] = useState({
        error:false,
        message_error:''
    })
    const fecha = new Date();

    const [periodos, setPeriodos] = useState([]);
    const [inscripcciones, setInscripcciones] = useState([]);

    const [anio, setAnio] = useState(fecha.getFullYear());
    const [periodo, setPeriodo] = useState({val:'-1', opt:'Seleccione una opcci\u00F3n'});

    const handleInputChange = (event) => {
        toggleInscripccion(parseInt(event.target.id), event.target.checked);
    }
    

    

    useEffect(() => {        
        startModule();
    },[]);
    /*
    * Descripcion:	Cambia idioma del data table
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const paginacionOpcciones = {
        rowsPerPageText         : 'Filas por pagina',
        rangeSeparatorText      : 'de',
        selectAllRowsItem       : true,
        selectAllRowsItemText   : 'Todos',   
    }
    const columnasTabla = [
        {
            name:'Per\u00EDodo',
            selector:row => row.periodo,
            sortable:true,
            center:true
        },
        {
            name:'Descripcci\u00F3n',
            selector:row => row.descp,
            sortable:true,
            left:true

        },
        {
            name:'Fecha creaci\u00F3n',
            selector:row => row.created_date,
            sortable:true,
            center:true

        },
        {
            name:'Fecha inhabilitaci\u00F3n',
            selector:row => row.deleted_date,
            sortable:true,
            center:true
        },
        {   
            name:'Acciones',
            cell:(row) =>  
                <>
                    {row.state &&
                    <>  
                        <img    className = "image" src = {cancelar} width = "30" height = "30" alt="User Icon" title= "Inhabilitar periodo" 
                        style = {{marginRight:5}}
                        onClick = {() => InhabilitarPeriodo(row.id)} id={row.id}
                        />
                        
                        
                    </>
                    }
                </>
                ,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
        }
        
    ];
    


    /*
    * Descripcion: Inicialializa el estado del modulo 
    * 'Registrar firma'
    * Fecha de la creacion:		29/04/2022
    * Author:					Eduardo B 
    */
    const startModule = async () =>{

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;

        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
        axios({
        method: 'get',
        url: baseURL+'/protocolos/periodo/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
        })
        .then(response =>{            
            
            setPeriodos(response.data.periodos);
            setInscripcciones(response.data.inscripcciones);
            
            
        }).catch(error =>{
            if(response.status === 401) auth.sesionExpirada();
                auth.onError();    
        });
        
        
        


    }
    /*
    * Descripcion: Inicialializa el estado del modulo 
    * 'Registrar firma'
    * Fecha de la creacion:		29/04/2022
    * Author:					Eduardo B 
    */
    const crearPeriodo = async () =>{
    
        if(fecha.getFullYear() != anio){
            Swal.fire({
            icon: 'info',
            html : 'Seleccione un a\u00F1o',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                cat_anio.current.focus();
                
            }
            })
            return;
        }
        if(parseInt(periodo.val) === -1){
            Swal.fire({
            icon: 'info',
            html : 'Seleccione un per\u00EDodo escolar',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                cat_periodo.current.focus();
            }
            })
            return;
        }

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        
        axios({
        method: 'post',
        url: baseURL+'/protocolos/periodo/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            'periodo'   : periodo.val,
            'anio'      : anio,
            'descp'     : periodo.opt
        }
        })
        .then(response =>{            
            
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
            }).then(function(){
                limpiarCampos();
                startModule();    
            })
            

            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });

        

    }
    
    /*
    * Descripcion: Inhabilita un periodo
    * 'Registrar firma'
    * Fecha de la creacion:		29/04/2022
    * Author:					Eduardo B 
    */
    const InhabilitarPeriodo = async (id) =>{
        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        Swal.fire({
            title: '',
            html: "<strong>\u00bfEsta seguro que desea elimar el per\u00EDodo\u003F</strong>",
            icon: 'info',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            allowEscapeKey : false,
            allowOutsideClick: false
            }).then((result) => {
                
                if(result.value){
                    
                    axios({
                    method: 'delete',
                    url: baseURL+'/protocolos/periodo/'+encodeURI(id)+'/',
                    headers: {
                        'Authorization': `Bearer ${ token }`
                    }
                    })
                    .then(response =>{            
                        
                        Swal.fire({
                        icon: 'success',
                        html : response.data.message,
                        showCancelButton: false,
                        focusConfirm: false,
                        allowEscapeKey : false,
                        allowOutsideClick: false,
                        confirmButtonText:'Aceptar',
                        confirmButtonColor: '#39ace7',
                        preConfirm: () => {
                            limpiarCampos();
                            startModule();
                        }
                        })
            
                        
                    }).catch(error =>{
                        if(!error.status)
                            auth.onError()
                        auth.onErrorMessage(error.response.data.message);
            
                    });
                    
    
                }//end-if
            })


        


    }
    /*
    * Descripcion: Inhabilita un periodo
    * 'Registrar firma'
    * Fecha de la creacion:		29/04/2022
    * Author:					Eduardo B 
    */
    const toggleInscripccion = async (id, toggle) =>{
        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
        axios({
        method: 'post',
        url: baseURL+'/protocolos/inscripccion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            'id'    : id,
            'state' : toggle
        }
        })
        .then(response =>{            
            
            
            setInscripcciones(response.data.inscripcciones);
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
            }).then(function(){
            })
            
            

            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });


    }

    /*
    * Descripcion: Limpia campos
    * 'Registrar firma'
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    const limpiarCampos = async () =>{
        setAnio(fecha.getFullYear())
        setPeriodo({val:'-1', opt:'Seleccione una opcci\u00F3n'});
    }
    

    

   
    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{ setShow(false); } 
    const handleShow = () =>{ setShow(true); } 
    return(
        
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Administraci&oacute;n de cat&aacute;logos de inscripcci&oacute;n de protocolos</div>
                </div>
            </div>
            

                <div className= "row" style = {{marginTop:30}} >
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Año</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6"> 
                        <select className = "form-select" 
                            value = {anio}
                            onChange = {(e) =>{
                                setAnio(e.target.value);
                            }}
                            disabled
                            ref = {cat_anio}
                        >
                            <option value = {anio} >{anio}</option>
                        </select>

                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Per&iacute;odo escolar</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <select className = "form-select" 
                            value = {periodo.val}
                            onChange = {(e) =>{
                                setPeriodo({val:e.target.value, opt:e.target.options[e.target.selectedIndex].text});
                            }}
                            ref = {cat_periodo}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            <option value = '2' >Semestre Enero a Junio</option>
                            <option value = '1' >Semestre Agosto  a Diciembre</option>
                        </select>
                    </div>
                </div>
                <div className = "row" style = {{marginTop:20}} >
                    <div className = "col-12 d-flex justify-content-center">
                        <img className="image" src={save} onClick = {crearPeriodo} width = "30" height = "30" alt="User Icon" title= "Crear firma electr&oacute;nica" style = {{marginRight:5}}/>
                        <img className="image" src={search} onClick = {handleShow} width = "30" height = "30" alt="User Icon" title= "Tipos de inscripcci&oacute;n" style = {{marginRight:5}}/>
                        <img className="image" src={limpiar} onClick = {limpiarCampos} width = "35" height = "35" alt="User Icon" title= "Limpiar campos" />
                    </div>
                </div>

                <DataTable
                    columns = {columnasTabla}
                    data = {periodos}
                    title = "Periodos disponibles"
                    noDataComponent="No existen registros disponibles"
                    pagination
                    paginationComponentOptions = {paginacionOpcciones}
                    fixedHeaderScrollHeight = "600px"
                />


          
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Cat&aacute;logos de inscripcciones</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="form-check form-switch">
                        {inscripcciones.map((i, index) =>(
                            <div  className = "row" key = {index}>
                                <div className = "col-12 d-flex justify-content-start ">
                                    <input  name = "key"
                                            className="form-check-input" 
                                            type="checkbox" role="switch"
                                            id = {i.id}
                                            onChange = {handleInputChange} 
                                            checked = {i.state}

                                            />
                                    &nbsp;&nbsp;<label className="form-check-label" htmlFor="flexSwitchCheckChecked" >Inscripcci&oacute;n {i.descp}</label>
                                </div>
                            </div>
                        ))}
                    </div>

                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={cancelar} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>
        </div>

       
    )
}