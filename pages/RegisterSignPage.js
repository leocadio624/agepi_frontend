import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';
import {Modal, Spinner} from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";

import create_file from '../assetss/images/create-file.png';
import delete_icon from '../assetss/images/delete.png';
import lupa from '../assetss/images/lupa.png';
import email from '../assetss/images/email2.png';
import limpiar from '../assetss/images/iconoBorrar.png';
import folder from '../assetss/images/folder.png';
import digital_key from '../assetss/images/digital_key.png';



const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterignPage(){

    const auth = useAuth();
    const [transaction, setTransaction] = useState(false);
    const [datos, setDatos] = useState({
        password:''
    });
    const [estado, setEstado] = useState({
        error:false,
        message_error:''
    })
    const [firmas, setFirmas] = useState([]);
    const [vigencia, setVigencia] = useState('-1');
    const [passwordShown, setPasswordShown] = useState(false);

    

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
            name:'Fecha creaci\u00F3n',
            selector:row => row.created_date,
            sortable:true,
            center:true
        },
        {
            name:'Fecha vencimiento',
            selector:row => row.vigencia_firma,
            sortable:true,
            center:true

        },
        {
            name:'Fecha cancelaci\u00F3n',
            selector:row => row.cancel_date,
            sortable:true,
            center:true
        },
        {   
            name:'Acciones',
            cell:(row) =>  
                <>
                    {row.state &&
                    <>  
                        <img    className = "image" src = {email} width = "30" height = "30" alt="User Icon" title= "Enviar contraseña via correo electr&oacute;nico" 
                        style = {{marginRight:5}}
                        onClick = {() => enviarPass(row.id)} id={row.id}
                        />
                        {/*
                        <img    className = "image" src = {folder} width = "30" height = "30" alt="User Icon" title= "Descargar certificado de firma electr&oacute;nica" 
                        style = {{marginRight:5}}
                        onClick = {() => descargarArchivo(row.ruta_public_key)} id={row.id}
                        />
                        */}
                        <img    className = "image" src = {digital_key} width = "30" height = "30" alt="User Icon" title= "Descargar llave privada de firma electr&oacute;nica" 
                        style = {{marginRight:5}}
                        onClick = {() => descargarArchivo(row.ruta_private_key)} id={row.id}
                        />

                        <img    className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Cancelar firma electr&oacute;nica" 
                        style = {{marginRight:5}}
                        onClick = {() => cancelarFirma(row.id, row.ruta_public_key, row.ruta_private_key)} id={row.id}
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



    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:(event.target.value).trim()
        })
        setEstado({error:false, message_error:''});
    }
    /*
    * Descripcion: Muestra el password ingresado
    * 'Registrar firma'
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };
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
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        beginTransaction();
        axios({
        method: 'get',
        url: baseURL+'/firma/firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        })
        .then(response =>{
            endTransaction();
            setFirmas(response.data)
            
        }).catch(error =>{
            endTransaction();
            auth.onError();    
        });


    }

    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const crearFirma = async () =>{

        if(parseInt(vigencia) === -1){
            setEstado({error:true, message_error:'Seleccione una vigencia para su firma electr\u00F3nica'});
            return;
        }
        if(datos.password === ''){
            setEstado({error:true, message_error:'Ingrese una contrase\u00F1a de clave privada'});
            return;
        }

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/firma/firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            'fk_user'       : user.id,
            'rol_user'      : user.rol_user,
            'name'          : user.name,
            'last_name'     : user.last_name,
            'vigencia'      : vigencia,
            'password'      : datos.password
        }
        })
        .then(response =>{
            endTransaction();
            if(response.status === 226){
                Swal.fire({
                icon: 'info',
                html : response.data.message,
                showCancelButton: false,
                focusConfirm: false,
                allowEscapeKey : false,
                allowOutsideClick: false,
                confirmButtonText:'Aceptar',
                confirmButtonColor: '#39ace7',
                preConfirm: () => {
                    setVigencia('-1');
                    setDatos({password:''});
                }
                })

            }else if(response.status === 200){
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
                }).then(function(){
                    setVigencia('-1');
                    setDatos({password:''});
                    startModule();
                    
                })

            }
            
        }).catch(error =>{
            endTransaction();
            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
        });
    }
    const limpiarCampos = async () =>{
        setVigencia('-1');
        setDatos({password:''});
        setEstado({error:false, message_error:''});
    }
    /*
    * Descripcion: Inhabilita firma electronica de usuario
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    
    const descargarArchivo = async (ruta_archivo) =>{
        
        let arr = ruta_archivo.split('/');
        let nombreArchivo = arr[arr.length-1];
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/firma/descarga_firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            ruta_archivo:ruta_archivo
        }
        })
        .then(response =>{
            endTransaction();
            let blob        = new Blob([response.data]);
            let link        = document.createElement('a');
            link.href       = window.URL.createObjectURL(blob);
            link.download   = nombreArchivo;
            link.click();
            
            
        }).catch(error =>{
            endTransaction();
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            

        });

    }

    /*
    * Descripcion: Inhabilita firma electronica de usuario
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    const cancelarFirma = async (id, ruta_public_key, ruta_private_key) =>{

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
        beginTransaction();
        axios({
        method: 'delete',
        url: baseURL+'/firma/firma/'+encodeURI(id)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            ruta_public_key : ruta_public_key,
            ruta_private_key: ruta_private_key
        }
        })
        .then(response =>{
            endTransaction();
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500
            }).then(function(){
                startModule();
            })
            
            
        }).catch(error =>{
            endTransaction();
            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
        });

    }
    /*
    * Descripcion: Inhabilita firma electronica de usuario
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    const enviarPass = async (id) =>{
        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/firma/pass/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            pk_firma : id
        }
        })
        .then(response =>{
            endTransaction();
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
                
            }
            })
            
            
        }).catch(error =>{
            endTransaction();
            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
        });
        

    }
    const beginTransaction = () =>{ setTransaction(true); } 
    const endTransaction = () =>{ setTransaction(false); }
    return(
        
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Administraci&oacute;n de firma electr&oacute;nica</div>
                </div>
            </div>

            {estado.error === true &&
                    <div className = "alert alert-danger" role="alert" style = {{marginTop:10}}>
                        {estado.message_error}
                    </div>
            }
            <div className = "row" style = {{marginTop:20}}>

                <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Vigencia firma</div>
                </div>
                <div className = "col-lg-4 col-md-4 col-sm-6">
                    <select className = "form-select" 
                        value = {vigencia}
                        onChange = {(e) =>{
                            setVigencia(e.target.value);
                            setEstado({error:false, message_error:''});
                        }}
                    >
                        <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                        <option value = "1" >1 a&ntilde;o</option>
                        <option value = "2" >2 a&ntilde;os</option>
                        <option value = "3" >3 a&ntilde;os</option>
                    </select>
                </div>
                <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Contrase&ntilde;a de clave privada</div>
                </div>
                <div className = "col-lg-4 col-md-4 col-sm-6">
                    <input type={passwordShown ? "text" : "password"} className = "form-control" name = "password" onChange = {handleInputChange} value = {datos.password} />
                    <img    className="" src={lupa} 
                            onClick = {togglePassword} width = "20" height = "20" alt="User Icon"
                            title= {passwordShown ? "Ocultar contrase\u00F1a" : "Mostrar contrase\u00F1a"}  style={{cursor:"pointer"}}/>
                    
                </div>
            </div>
            <div className = "row" style = {{marginTop:20}} >
                <div className = "col-12 d-flex justify-content-center">
                    <img className="image" src={create_file} onClick = {crearFirma} width = "30" height = "30" alt="User Icon" title= "Crear firma electr&oacute;nica" style = {{marginRight:5}}/>
                    <img className="image" src={limpiar} onClick = {limpiarCampos} width = "35" height = "35" alt="User Icon" title= "Limpiar campos" />
                </div>
            </div>

            <div className = "row" >
                <div className = "col-12 tb-responsive">
                    <DataTable
                        columns = {columnasTabla}
                        data = {firmas}
                        title = "Firmas generadas"
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                </div>
            </div>        

            <Modal size = "sm" show={transaction} centered >
                <Modal.Header closeButton  className = "bg-dark" >
                <Modal.Title >
                    <div className = "title" >Procesando...</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className = "row" >
                        <div className = "col-12 d-flex justify-content-center" >
                            <Spinner animation="border" style={{ width: "3rem", height: "3rem" }} />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}