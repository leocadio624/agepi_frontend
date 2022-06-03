//import { useParams } from 'react-router-dom'
import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';
import {Modal, Button} from 'react-bootstrap';

import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";
import Swal from 'sweetalert2';

import pdf from '../assetss/images/pdf.png';
import firma from '../assetss/images/firma-digital.png';
import cancel from '../assetss/images/cancelar.png';
import engrane from '../assetss/images/engrane.png';
import lupa from '../assetss/images/lupa.png';
import ver from '../assetss/images/ver.png';
const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function SigningRequestPage(){
    
    const public_ref = useRef();
    const private_ref = useRef();
    const pass_ref = useRef();
    const form_ref = useRef();
    const form_sat = useRef();
    const [passwordShown, setPasswordShown] = useState(false);
    
    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [showSat, setShowSat] = useState(false);
    const [firmaSat, setFirmaSat] = useState(false);
    const [solicitudes, setSolicitudes] = useState([]);

     const [publicFile, setPublicFile] = useState(null);
    const [privateFile, setPrivateFile] = useState(null);
    const [fileProtocol, setFileProtocol] = useState('');
    const [pkProtocol, setPkProtocol] = useState(0);
    
    const [protocolo, setProtocolo] = useState({'numero':'', 'titulo':'', 'resumen':'', 'periodo':''});
    const [firmantes, setFirmantes] = useState([]);
    const [showDet, setShowDet] = useState(false);


    

    useEffect(() => {
        startModule();
    },[]);

    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		11/05/2022
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
        url: baseURL+'/protocolos/solicitudes_firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        
        })
        .then(response =>{
            setSolicitudes(response.data);
            
        }).catch(error => {
            auth.onError();
            
            
        });
        

    }

    /*
    * Descripcion:	Visualiza el archivo de protocolo
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const descargarArchivo = async (pk_protocol, path) => {

        
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
    * Descripcion:	Visualiza el archivo de protocolo
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const existeFirma = async (pk_protocol, fileProtocol) => {


        setFileProtocol(fileProtocol);        
        setPkProtocol(pk_protocol);


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
        url: baseURL+'/protocolos/existeFirma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'pk_user'      : user.id,
            'pk_protocol'  : pk_protocol
        }
        })
        .then(response =>{

            if(response.status === 206){
                Swal.fire({
                title: '',
                html: "<div style = 'font-size:13px;'><strong>No tienes con una firma electr\u00F3nica registrada en la aplicaci\u00F3n</strong></div><br><div style = 'font-size:14px;' >\u00bfCuentas con una firma electr\u00F3nica de una entidad certificadora(SAT)\u003F</div>",
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
                        handleShowSat();
                        setFirmaSat(true);
                    }//end-if
                })
                
            }else if(response.status === 226){
                Swal.fire({
                title: '',
                icon: 'info',
                html : '<strong>'+response.data.message+'</strong>',
                showCancelButton: false,
                focusConfirm: false,
                allowEscapeKey : false,
                allowOutsideClick: false,
                confirmButtonText:'Aceptar',
                confirmButtonColor: '#39ace7',
                preConfirm: () => {
            
                }
                })
                
            }else if(response.status === 200){
                handleShow();
                setFirmaSat(false);
                
            }


        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
                        
        });
        
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
    * Descripcion:	Firma protocolo con firma generada
    * por aplicacion
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const firmarProtocolo = async (event) => {
        event.preventDefault();


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

    
        let formData = new FormData( form_ref.current );
        formData.append('fileProtocol', fileProtocol);
        formData.append('pk_user', user.id);
        formData.append('pk_protocol', pkProtocol);

        axios({
        method: 'post',
        url: baseURL+'/protocolos/firmaDocumento/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : formData
        })
        .then(response =>{

            Swal.fire({
            title: '',
            icon: 'success',
            html: "<div><strong>"+response.data.message+"</strong></div>",
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                handleClose();
                startModule();
                
            }
            })

                

        }).catch(error => {
            
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
            
                        
        });


    }
    /*
    * Descripcion:	Firma protocolo con firma generada
    * por el SAT
    * Fecha de la creacion:		02/06/2022
    * Author:					Eduardo B 
    */
    const firmarProtocoloSat = async (event) => {
        event.preventDefault();
        
        
        
        if( public_ref.current.value === ''){
            auth.swalFire('Seleccione un archivo de clave publica');
            public_ref.current.focus();
            return;
        }
        if( private_ref.current.value === ''){
            auth.swalFire('Seleccione un archivo de clave publica');
            private_ref.current.focus();
            return;
        }
        if( public_ref.current.value.trim() === ''){
            auth.swalFire('Ingrese la contrase\u00F1a de clave privada');
            pass_ref.current.focus();
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

        
        let formData = new FormData( form_sat.current );
        formData.append('fileProtocol', fileProtocol);
        formData.append('pk_user', user.id);
        formData.append('pk_protocol', pkProtocol);
        
        console.log(formData);
        return;


        axios({
        method: 'post',
        url: baseURL+'/protocolos/firmaDocumento/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : formData
        })
        .then(response =>{

            Swal.fire({
            title: '',
            icon: 'success',
            html: "<div><strong>"+response.data.message+"</strong></div>",
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                handleClose();
                startModule();
                
            }
            })

                

        }).catch(error => {
            
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
            
                        
        });


    }

    /*
    * Descripcion:	Abre modal con detalles de protocolo
    * Fecha de la creacion:		12/05/2022
    * Author:					Eduardo B 
    */
    const detallesProtocolo = async (pk_protocol, numero, titulo, resumen, periodo, firmantes) => {
        setProtocolo({'numero':numero, 'titulo':titulo, 'resumen':resumen, 'periodo':periodo});
        setFirmantes(firmantes);
        showModalDetalles();

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
        selectAllRowsItemText   : 'Todos',
        
    }
    const columnas = [
        {
            name:'T\u00EDtulo',
            selector:row => row.titulo,
            sortable:true,
            center:true
        },
        {
            name:'Fecha solicitud',
            selector:row => row.fecha,
            sortable:true,
            center:true
        },
        {
            name:'N\u00FAmero de firmas',
            selector:row => row.numeroFirmas,
            sortable:true,
            center:true

        },
        {
            name:'Per\u00EDodo',
            selector:row => row.periodo,
            sortable:true,
            left:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>
            
                            {   row.numeroFirmas > 0 &&
                            <img    className = "image" src = {pdf} width = "30" height = "30" alt="User Icon" title= "Ver archivo protocolo" 
                            onClick = {() => descargarArchivo(row.pk_protocol, row.path_protocol)} style = {{marginRight:7}}/>
                            

                            }
                            <img    className = "image" src = {ver} width = "30" height = "30" alt="User Icon" title= "Ver detalles protocolo" 
                                    onClick = {() => detallesProtocolo(row.pk_protocol, row.numero, row.titulo, row.summary, row.periodo, row.firmantes )} style = {{marginRight:7}}/>
                            
                            {   row.state === true &&
                                <img    className = "image" src = {firma} width = "30" height = "30" alt="User Icon" title= "Firmar protocolo" 
                                onClick = {() => existeFirma(row.pk_protocol, row.path_protocol)} style = {{marginRight:7}}/>

                            }

                            

                            
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
    ];

    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{ 
        setShow(false); 
        setFileProtocol(''); 
        setPkProtocol(0);
        togglePassword();

    }
    const handleShow = () =>{ setShow(true); }

    const handleCloseSat = () =>{ 
        setShowSat(false); 
        setFileProtocol(''); 
        setPkProtocol(0);
        togglePassword();


    }
    const handleShowSat = () =>{ setShowSat(true); }


    /*
    * Descripcion:	Despliegue y cierre de centana modal con detalles
    * de protocolo
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const closeModalDetalles = () =>{ 
        setProtocolo({'numero':'', 'titulo':'', 'resumen':'', 'periodo':''});
        setFirmantes([]);
        setShowDet(false); 
    }
    const showModalDetalles = () =>{ 
        setShowDet(true); 
    }


    

    

    return(
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Solicitudes firma</div>
                </div>
            </div>

            <div className = "row" >
                <div className = "col-12 tb-responsive">

                    
                    <DataTable
                        columns = {columnas}
                        data = {solicitudes}
                        title = ""
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                    
                </div>
            </div>

            <Modal size = "lg" show={showSat} onHide={handleCloseSat}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Firma de protocolo</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <form ref={form_ref}  encType="multipart/form-data" onSubmit = {firmarProtocolo}>
                
                    
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center">
                            <div className = "label-form" >Clave publica (archivivo .cer)</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input className = "form-control" ref = {public_ref} name = "public_key" type="file"
                                onChange = {(e) => {

                                    const nameFile = e.target.files[0].name;
                                    const sizeFile = e.target.files[0].size;
                                                                
                                    if(nameFile.toLowerCase().match(/([^\s]*(?=\.(cer))\.\2)/gm)!=null){                                
                                        setPublicFile(e.target.files[0]);

                                    }else{
                                        
                                        Swal.fire({
                                        icon: 'info',
                                        html : 'El formato del archivo debe ser .cer',
                                        showCancelButton: false,
                                        focusConfirm: false,
                                        allowEscapeKey : false,
                                        allowOutsideClick: false,
                                        confirmButtonText:'Aceptar',
                                        confirmButtonColor: '#39ace7',
                                        preConfirm: () => {
                                            public_ref.current.value = null;
                                            setPublicFile(null);

                                        }
                                        })
                                    }


                                }} 
                            />
                        </div>
                    </div>
                    

                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center">
                            <div className = "label-form" >Clave privada (archivivo .key)</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input className = "form-control" ref = {private_ref} name = "private_key" type="file"
                                onChange = {(e) => {

                                    const nameFile = e.target.files[0].name;
                                    const sizeFile = e.target.files[0].size;
                                                                
                                    if(nameFile.toLowerCase().match(/([^\s]*(?=\.(key))\.\2)/gm)!=null){                                
                                        setPrivateFile(e.target.files[0]);
                                        

                                    }else{
                                        
                                        Swal.fire({
                                        icon: 'info',
                                        html : 'El formato del archivo debe ser .key',
                                        showCancelButton: false,
                                        focusConfirm: false,
                                        allowEscapeKey : false,
                                        allowOutsideClick: false,
                                        confirmButtonText:'Aceptar',
                                        confirmButtonColor: '#39ace7',
                                        preConfirm: () => {
                                            private_ref.current.value = null;
                                            setPrivateFile(null);

                                        }
                                        })
                                    }


                                }} 
                            />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center">
                            <div className = "label-form" >Contrase&ntilde;a de firma electr&oacute;nica</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input type={passwordShown ? "text" : "password"} ref = {pass_ref} className = "form-control" name = "password"  />
                            <img    className="" src={lupa} 
                                onClick = {togglePassword} width = "20" height = "20" alt="User Icon"
                                title= {passwordShown ? "Ocultar contrase\u00F1a" : "Mostrar contrase\u00F1a"}  style={{cursor:"pointer"}}/>
                        </div>
                    </div>

                </form>
                    
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={engrane} onClick={firmarProtocoloSat}  width = "30" height = "30" alt="User Icon" title= "Firmar" />
                    <img className="image" src={cancel} onClick={handleCloseSat} width = "30" height = "30" alt="User Icon" title= "Cerrar" />        
                </Modal.Footer>
            </Modal>

            <Modal size = "lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Firma de protocolo</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <form ref={form_sat}  encType="multipart/form-data" onSubmit = {firmarProtocolo}>
                                    
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center">
                            <div className = "label-form" >Clave privada (archivivo .key)</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input className = "form-control" ref = {private_ref} name = "private_key" type="file"
                                onChange = {(e) => {

                                    const nameFile = e.target.files[0].name;
                                    const sizeFile = e.target.files[0].size;
                                                                
                                    if(nameFile.toLowerCase().match(/([^\s]*(?=\.(key))\.\2)/gm)!=null){                                
                                        setPrivateFile(e.target.files[0]);
                                        

                                    }else{
                                        
                                        Swal.fire({
                                        icon: 'info',
                                        html : 'El formato del archivo debe ser .key',
                                        showCancelButton: false,
                                        focusConfirm: false,
                                        allowEscapeKey : false,
                                        allowOutsideClick: false,
                                        confirmButtonText:'Aceptar',
                                        confirmButtonColor: '#39ace7',
                                        preConfirm: () => {
                                            private_ref.current.value = null;
                                            setPrivateFile(null);

                                        }
                                        })
                                    }


                                }} 
                            />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center">
                            <div className = "label-form" >Contrase&ntilde;a de firma electr&oacute;nica</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input type={passwordShown ? "text" : "password"} ref = {pass_ref} className = "form-control" name = "password"  />
                            <img    className="" src={lupa} 
                                onClick = {togglePassword} width = "20" height = "20" alt="User Icon"
                                title= {passwordShown ? "Ocultar contrase\u00F1a" : "Mostrar contrase\u00F1a"}  style={{cursor:"pointer"}}/>
                        </div>
                    </div>

                </form>
                    
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={engrane} onClick={firmarProtocolo}  width = "30" height = "30" alt="User Icon" title= "Firmar" />
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
                            <input value = {protocolo.titulo} className = "form-control" type = "text" disable = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >Resumen protocolo</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                        <textarea value = {protocolo.resumen} className = "form-control"  rows="3" onChange = {(e) => {return}} disable = "true"></textarea>
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >Per&iacute;odo inscrpcci&oacute;n</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input value = {protocolo.periodo} className = "form-control" type = "text" disable = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <div className = "row row-form">
                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                            <div className = "label-form" >N&uacute;mero protocolo</div>
                        </div>
                        <div className = "col-lg-8 col-md-8 col-sm-12">
                            <input value = {protocolo.numero} className = "form-control" type = "text" disable = "true" onChange = {(e) => {return}} />
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <h5>Firmantes</h5>
                    {firmantes.map((i, index) =>(
                        <div className = "row row-form" key = {index}>
                            <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                                <label className = ""  >{i.nombre}</label>
                            </div>
                            <div className = "col-lg-8 col-md-8 col-sm-12">
                                <label className = "" style = {{fontSize:13}} >{i.fecha_firma}</label>
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