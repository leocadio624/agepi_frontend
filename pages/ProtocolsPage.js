import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';



import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";


import ver from '../assetss/images/ver.png';
import check from '../assetss/images/comprobado.png';
import clasificar from '../assetss/images/search.png';
import folder from '../assetss/images/pdf.png';
import cancel from '../assetss/images/cancelar.png';
import delete_icon from '../assetss/images/delete.png';
import lupa  from '../assetss/images/lupa.png';
import create_file  from '../assetss/images/create-file.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ProtocolsPage(){

    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [showDet, setShowDet] = useState(false); //modal detalles protocolo
    const [protocols, setProtocols] = useState([]);
    const [protocolo, setProtocolo] = useState( {'numero':'', 'titulo':'', 'resumen':'', 'periodo':''});
    const [keyList, setKeyList] = useState([]);
    const [clasificaciones, setClasificaciones] = useState([]);

    const [periodo, setPeriodo] = useState('-1');
    const [periodos, setPeriodos] = useState([]);
    const [estado, setEstado] = useState('-1');
    const [estados, setEstados] = useState([]);
    const [academias, setAcademias] = useState([]);
    const [pkProtocol, setPkProtocol] = useState(0);
    

    const handleInputChange = (event) => {

        let aux = []
        academias.forEach(function(i){
            if(i.id === parseInt(event.target.id)){i.estado = event.target.checked}
            aux.push(i)
        });
        setAcademias(aux);

    }

    useEffect(() => {
        startModule();
    },[]);


    /*
    * Descripcion:	Muestra lista de protocolos
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const startModule = async () => {

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
        url: baseURL+'/protocolos/ProtocolCattStart/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
        })
        .then(response =>{
            
            let aux_academias = [];
            setPeriodos(response.data.periodos);
            setEstados(response.data.estados);
            setProtocols(response.data.protocolos);

            response.data.academias.forEach(function(i){ aux_academias.push({'id':i.id ,'academia':i.academia,'estado':false});});
            setAcademias(aux_academias);

            
        }).catch(error => {
            setProtocols([]);
            if(!error.status)
                auth.onError()
            
        });
            
    }

    /*
    * Descripcion:	Funcion inhabilitada en esta vista
    * Fecha de la creacion:		19/05/2022
    * Author:					Eduardo B
    * Descripcion:	Eliminacion de palabra clave.
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    /*
    const deleteWord = async (id) =>{

    
    
        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        axios({
            method: 'delete',
            url: baseURL+'/protocolos/palabras_clave/'+encodeURIComponent(id)+'/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
            
        })
        .then(response =>{
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registro eliminado',
            showConfirmButton: false,
            timer: 1500
            }).then(function() {
                watchWordsHandler(response.data.fk_protocol);
            })
            

        }).catch(error => {
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
                        
        });

    }
    */

    /*
    * Descripcion:	Muestra detalles de protocolo de palabras clave por protocolo
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const watchWordsHandler = async (id, numero, titulo, resumen, periodo) => {
        
        setProtocolo({'numero':numero, 'titulo':titulo, 'resumen':resumen, 'periodo':periodo});
        showModalDetalles();

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
        url: baseURL+'/protocolos/palabras_clave_list/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'key': id
        }
        })
        .then(response =>{
            setKeyList(response.data)
            //setShow(true);
            //console.log(response.data);
            
        }).catch(error => {
            if(!error.status)
                auth.onError();
                
        });

        
        
        
                
    }
    /*
    * Descripcion:	Descarga de protocolo en ventana emergente.
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const watchProtocolHandler = async (pk_protocol, path) =>{

        if(path === ''){
            auth.onError();
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
        url: baseURL+'/protocolos/crearDocumentoFirmas/',
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            pk_protocol : pk_protocol,
            fileProtocol : path
        }
        })
        .then(response =>{            

            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            window.open(fileURL, "_blank", strWindowFeatures);


        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });

        
    }

    
    /*
    * Descripcion:	Filtra protocolos con entradas de
    * catalogos.
    * Fecha de la creacion:		19/05/2022
    * Author:					Eduardo B 
    */
    const filtrarProtocolos = async () =>{
 

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
        url: baseURL+'/protocolos/filtrarProtocolos/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            periodo : parseInt(periodo),
            estado : parseInt(estado)
        }
        })
        .then(response =>{
            setProtocols(response.data);

        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });
        

        


    }

    /*
    * Descripcion:	Cambia de estado a todos los protocolos por periodo a estado 5
    * Fecha de la creacion:		21/05/2022
    * Author:					Eduardo B 
    */
    const enviarProtocolosAcademias = async () =>{
        

        if(protocols.length === 0){
            auth.swalFire('No existen protocolos por enviar a las academias');
            return;
        }
        let protocolos = []
        protocols.forEach(function(i){ protocolos.push(i.id); });

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
        url: baseURL+'/protocolos/asignacionAcademias/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            protocolos : protocolos
        }
        })
        .then(response =>{
            
            Swal.fire({
            icon: 'success',
            html : '<strong>'+response.data.message+'</strong>',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                filtrarProtocolos();
            }
            })

        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });
        

        


    }


    /*
    * Descripcion:	Abre modal para clasificar protocolo
    * por academias.
    * Fecha de la creacion:		19/05/2022
    * Author:					Eduardo B 
    */
    const clasificarProtocolo = async (pk_protocol) =>{
        setPkProtocol(pk_protocol);
        handleShow();
    
    }
    /*
    * Descripcion:	Abre modal para clasificar protocolo
    * por academias.
    * Fecha de la creacion:		19/05/2022
    * Author:					Eduardo B 
    */
    const crearClasificacionProtocolo = async () =>{
        
        let check = 0
        let arr_academias = []
        academias.forEach(function(i){ 
            if(i.estado === true){
                arr_academias.push(i.id);
                check+=1;
            }
        });

        if(check !== 3){
            auth.swalFire('Debes seleccionar 3 academias por asignaci\u00F3n');
            return
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
        url: baseURL+'/protocolos/asignacionProtocolo/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            pk_protocol : pkProtocol,
            academias : arr_academias
        }
        })
        .then(response =>{
            

            Swal.fire({
            icon: 'success',
            html : '<strong>'+response.data.message+'</strong>',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                handleClose();
                filtrarProtocolos();
            }
            })

           

        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });
   
    }
    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{ 
        let aux = []
        academias.forEach(function(i){
            i.estado = false;
            aux.push(i)
        });
        setAcademias(aux);
        setShow(false); 
        setPkProtocol(0);

    } 
    const handleShow = () =>{ setShow(true); } 

    /*
    * Descripcion:	Despliegue y cierre de centana modal con detalles
    * de protocolo
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const closeModalDetalles = () =>{ 
        setProtocolo({'numero':'', 'titulo':'', 'resumen':'', 'periodo':''});
        setShowDet(false);

    }
    const showModalDetalles = () =>{ 
        setShowDet(true); 
    }
    /*
    * Descripcion:	Cambia idioma del data table
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const paginacionOpcciones = {
        rowsPerPageText         : 'Filas por pagina',
        rangeSeparatorText      : 'de',
        selectAllRowsItem       : true,
        selectAllRowsItemText   : 'Todos'
    }
    const columnas = [
        {
            name:'N\u00FAmero',
            selector:row => <div style = {{fontSize:11}}>{row.number}</div>,
            sortable:true,
            center:true
        },
        {
            name:'T\u00EDtulo',
            selector:row => <div style = {{fontSize:11}}>{row.title}</div>,
            sortable:true,
            center:true
        },
        {
            name:'Per\u00EDodo',
            selector:row => <div style = {{fontSize:11}}>{row.periodo}</div>,
            sortable:true,
            center:true

        },
        {
            name:'Estado',
            selector:row => <div style = {{fontSize:11}}>{row.estado}</div>,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>
                            {row.fk_protocol_state === 3 &&
                                <img  className = "image" src = {clasificar} width = "25" height = "25" alt="User Icon" title= "Asignar protocolo a academias" 
                                onClick = {() => clasificarProtocolo(row.id)}  style = {{marginRight:7}}/>
                            }
                            <img  className = "image" src = {ver} width = "25" height = "25" alt="User Icon" title= "Ver detalle" 
                                onClick = {() => watchWordsHandler(row.id, row.number, row.title, row.sumary, row.periodo)}  style = {{marginRight:7}}/>
                            <img  className = "image" src = {folder} width = "25" height = "25" alt="User Icon" title= "Ver protocolo" 
                                onClick = {() => watchProtocolHandler(row.id, row.fileProtocol)} id={row.id} />
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];



    return(
        

        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Protocolos registrados</div>
                </div>
            </div>

            <div className = "row" style = {{marginTop:30, marginBottom:40}}>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Per&iacute;odo escolar</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                    
                        <select className = "form-select" 
                            value = {periodo}
                            onChange = {(e) =>{
                                setPeriodo(e.target.value);
                            }}
                        >
                            <option value = "-1"  >Todos</option>
                            {periodos.map((obj, index) =>(
                                <option key = {index} value = {obj.id} >{obj.periodo}</option>
                            ))}
                        </select>

                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Estado</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <select className = "form-select"
                            value = {estado}
                            onChange = {(e) =>{
                                setEstado(e.target.value);
                            }}
                        >
                            <option value = "-1"  >Todos</option>
                            {estados.map((obj, index) =>(
                                <option key = {index} value = {obj.protocol_state} >{obj.description}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className = "row" style = {{marginTop:30, marginBottom:50}}>

                

                    <div className = "col-12 d-flex justify-content-center">
                        {parseInt(estado) === 4 && auth.user.rol_user === 3 &&
                            <img  className = "image" src = {create_file} width = "30" height = "30" alt="User Icon" title= "Enviar protocolos a academias"  onClick = {() => enviarProtocolosAcademias()} style = {{marginRight:7}}/>
                        }
                        <img  className = "image" src = {lupa} width = "30" height = "30" alt="User Icon" title= "Filtrar protocolos"  onClick = {() => filtrarProtocolos()}/>
                    </div>
                </div>

            
                <div className = "" style={{marginTop:20, marginBottom:20}}>

                    <DataTable
                    columns = {columnas}
                    data = {protocols}
                    title = ""
                    noDataComponent="No existen registros disponibles"
                    pagination
                    paginationComponentOptions = {paginacionOpcciones}
                    fixedHeaderScrollHeight = "600px"
                    />
                    
                </div>

                    
            
            
        
            
            
            

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Asignaci&oacute;n protocolo por academias</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <div className="form-check form-switch">
                        {academias.map((i, index) =>(
                            <div  className = "row" key = {index}>
                                <div className = "col-12 d-flex justify-content-start ">
                                    <input  name = "key"
                                            className="form-check-input" 
                                            type="checkbox" role="switch"
                                            id = {i.id}
                                            onChange = {handleInputChange}
                                            checked = {i.estado}

                                            />
                                    &nbsp;&nbsp;<label className="form-check-label" htmlFor="flexSwitchCheckChecked" style = {{fontSize:14}}><strong>{i.academia}</strong></label>
                                </div>
                                
                            </div>
                        ))}
                    </div>


                  
                    
                    
                
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={check}  onClick={crearClasificacionProtocolo} width = "30" height = "30" alt="User Icon" title= "Crear asignaci&oacute;n" />
                    <img className="image" src={cancel} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>

            <Modal size = "lg" show={showDet} onHide={closeModalDetalles}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Detalle protocolo</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >T&iacute;tulo</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input value = {protocolo.titulo} className = "form-control" type = "text" readOnly = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >Resumen protocolo</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                        <textarea value = {protocolo.resumen} className = "form-control"  rows="3" onChange = {(e) => {return}} readOnly = "true"></textarea>
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >Per&iacute;odo inscrpcci&oacute;n</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input value = {protocolo.periodo} className = "form-control" type = "text" readOnly = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >N&uacute;mero protocolo</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input value = {protocolo.numero} className = "form-control" type = "text" readOnly = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <h6>Palabras clave</h6>
                    {keyList.map((i, index) =>(
                        <div className = "row row-form" key = {index}>
                            <div className = "col-lg-6 col-md-6 col-sm-12 d-flex justify-content-start">
                                <input value = {i.word} className = "form-control" type = "text" readOnly = "true" onChange = {(e) => {return}} />
                            </div>
                        </div>

                    ))}

                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={cancel} onClick={closeModalDetalles} width = "30" height = "30" alt="User Icon" title= "Cerrar" readOnly/>        
                </Modal.Footer>
            </Modal>
        </div>







    )
            
}