import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import {Spinner} from 'react-bootstrap';
import Swal from 'sweetalert2';



import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";


import ver from '../assetss/images/ver.png';
import check from '../assetss/images/comprobado.png';
import clasificar from '../assetss/images/search.png';
import folder from '../assetss/images/pdf.png';
import cancel from '../assetss/images/cancelar.png';
import engrane from '../assetss/images/engrane.png';
import lapiz  from '../assetss/images/lapiz.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function ProtocolsPage(){
    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [transaction, setTransaction] = useState(false);
    const [dictamen, setDictamen] = useState('-1');
    const [protocols, setProtocols] = useState([]);
    const [protocolo, setProtocolo] = useState( {'numero':'', 'titulo':'', 'resumen':'', 'periodo':''});
    const [pkProtocol, setPkProtocol] = useState(0);
    const [summary, setSummary] = useState('');
    const [preguntas, setPreguntas] = useState([
        {'id':1, 'title':'T\u00EDtulo de TT.', 'ask':'\u00bfEl t\u00EDtulo corresponde al producto esperado\u003F', 'state':false, 'summary':''},
        {'id':2, 'title':'Resumen.', 'ask':'\u00bfEl resumen expresa claramente la propuesta del TT, su importancia y aplicaci\u00F3n\u003F', 'state':false, 'summary':''},
        {'id':3, 'title':'Palabras clave.', 'ask':'\u00bfLas palabras clave han sido clasificadas adecuadamente\u003F', 'state':false, 'summary':''},
        {'id':4, 'title':'Introducci\u00F3n.', 'ask':'\u00bfLa presentaci\u00F3n del problema a resolver es comprensible\u003F', 'state':false, 'summary':''},
        {'id':5, 'title':'Objetivo.', 'ask':'\u00bfEl objetivo es preciso y relevante\u003F', 'state':false, 'summary':''},
        {'id':6, 'title':'Planteamiento.', 'ask':'\u00bfEl planteamiento del problema y la tentativa soluci\u00F3n descrita son claros\u003F', 'state':false, 'summary':''},
        {'id':7, 'title':'Justificaci\u00F3n.', 'ask':'\u00bfSus contribuciones o beneficios estan completamente justificados\u003F', 'state':false, 'summary':''},
        {'id':8, 'title':'Resultados o productos esperados.', 'ask':'\u00bfSu viabilidad es adecuada\u003F', 'state':false, 'summary':''},
        {'id':9, 'title':'Metodolog\u00EDa', 'ask':'\u00bfLa propuesta metodol\u00F3gica es pertinente\u003F', 'state':false, 'summary':''},
        {'id':10, 'title':'Cronograma', 'ask':'\u00bfEl calendario de actividades por estudiante es adecuado\u003F', 'state':false, 'summary':''}
    ]);
    const [datos, setDatos] = useState({summary:''})

    const handleInputChange = (event) => {
        let aux = []
        preguntas.forEach(function(i){
            if(i.id === parseInt(event.target.id)){i.state = event.target.checked}
            aux.push(i)
        });
        setPreguntas(aux);
    }
    
    const handleTextChange = (event) => {
        let aux = []
        preguntas.forEach(function(i){
            if(i.id === parseInt(event.target.id)){i.summary = event.target.value}
            aux.push(i)
        });
    }
    const datosInputChange = (event) => {

        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
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

        beginTransaction();
        axios({
        method: 'get',
        url: baseURL+'/protocolos/protocolsProfesorInit/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        })
        .then(response =>{

            endTransaction();
            setProtocols(response.data);

            
        }).catch(error => {
            endTransaction();
            if(!error.status)
                auth.onError()
            
        });
        
            
    }

    /*
    * Descripcion:	Descarga de protocolo en ventana emergente.
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const watchProtocol = async (pk_protocol, path) =>{

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
        
        beginTransaction();
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
            endTransaction();
            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            window.open(fileURL, "_blank", strWindowFeatures);


        }).catch(error => {
            endTransaction();
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });

        
    }

    /*
    * Descripcion: Selecciona un protocolo para ser sinodal
    * Fecha de la creacion:		22/05/2022
    * Author:					Eduardo B 
    */
    const selectProtocol = async (pk_protocol) =>{
        
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
        html : '<strong>'+'\u00bfEsta seguro que desea ser sinodal de este protocolo\u003F'+'</strong>',
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
                beginTransaction();
                axios({
                method: 'post',
                url: baseURL+'/protocolos/selectProtocol/',
                headers: {
                    'Authorization': `Bearer ${ token }`
                },
                data : {
                    fk_protocol : pk_protocol,
                    fk_user     : user.id
                }
                })
                .then(response =>{            
        
                    endTransaction();
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
                        startModule();
                    }
                    })
        
        
                }).catch(error => {
                    endTransaction();
                    if(!error.status)
                        auth.onError();
                    auth.onErrorMessage(error.response.data.message);                
                });


                
            }//end-if
        })
    
    }

    /*
    * Descripcion: Selecciona un protocolo para ser sinodal
    * Fecha de la creacion:		22/05/2022
    * Author:					Eduardo B 
    */
    const verificaEvaluacion = async (pk_protocol) =>{
        
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
        
        
        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/protocolos/existeEvalucacion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            fk_user     : user.id,
            fk_protocol : pk_protocol
        }
        })
        .then(response =>{            
            endTransaction();
            if(response.status === 226){
                auth.swalFire(response.data.message);
            }else if(response.status === 200){
                setPkProtocol(pk_protocol);
                handleShow();
            }
            


        }).catch(error => {
            endTransaction();
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);                
        });
        
        
    
    }
    /*
    * Descripcion: Genera la evaluacion de protocolo
    * Fecha de la creacion:		23/05/2022
    * Author:					Eduardo B 
    */
    const generarEvalucacion = async () =>{

        
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

        if( parseInt(dictamen) === -1){
            auth.swalFire('Seleccione un dictamen para la propuesta');
            return;
        }

        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/protocolos/generarEvalucacion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            fk_user     : user.id,
            name        : user.name,
            last_name   : user.last_name,
            fk_protocol : pkProtocol,
            preguntas   : preguntas,
            summary     : datos.summary,
            dictamen    : parseInt(dictamen) === 1 ? true:false
        }
        })
        .then(response =>{            
            endTransaction();

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
            }
            })
            

        }).catch(error => {
            endTransaction();
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
        setPkProtocol(0);
        setPreguntas([
            {'id':1, 'title':'T\u00EDtulo de TT.', 'ask':'\u00bfEl t\u00EDtulo corresponde al producto esperado\u003F', 'state':false, 'summary':''},
            {'id':2, 'title':'Resumen.', 'ask':'\u00bfEl resumen expresa claramente la propuesta del TT, su importancia y aplicaci\u00F3n\u003F', 'state':false, 'summary':''},
            {'id':3, 'title':'Palabras clave.', 'ask':'\u00bfLas palabras clave han sido clasificadas adecuadamente\u003F', 'state':false, 'summary':''},
            {'id':4, 'title':'Introducci\u00F3n.', 'ask':'\u00bfLa presentaci\u00F3n del problema a resolver es comprensible\u003F', 'state':false, 'summary':''},
            {'id':5, 'title':'Objetivo.', 'ask':'\u00bfEl objetivo es preciso y relevante\u003F', 'state':false, 'summary':''},
            {'id':6, 'title':'Planteamiento.', 'ask':'\u00bfEl planteamiento del problema y la tentativa soluci\u00F3n descrita son claros\u003F', 'state':false, 'summary':''},
            {'id':7, 'title':'Justificaci\u00F3n.', 'ask':'\u00bfSus contribuciones o beneficios estan completamente justificados\u003F', 'state':false, 'summary':''},
            {'id':8, 'title':'Resultados o productos esperados.', 'ask':'\u00bfSu viabilidad es adecuada\u003F', 'state':false, 'summary':''},
            {'id':9, 'title':'Metodolog\u00EDa', 'ask':'\u00bfLa propuesta metodol\u00F3gica es pertinente\u003F', 'state':false, 'summary':''},
            {'id':10, 'title':'Cronograma', 'ask':'\u00bfEl calendario de actividades por estudiante es adecuado\u003F', 'state':false, 'summary':''}
        ]);
        setDatos({summary:''})
        setShow(false);
        setDictamen('-1');
        
    } 
    const handleShow = () =>{ setShow(true); } 

    const beginTransaction = () =>{ setTransaction(true); } 
    const endTransaction = () =>{ setTransaction(false); } 

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
                            
                            {row.num_select < 3 && row.lista_prof.includes(parseInt(auth.user.id)) === false &&
                                <>
                                <img  className = "image" src = {check} width = "25" height = "25" alt="User Icon" title= "Seleccionar protocolo" 
                                onClick = {() => selectProtocol(row.id)} id={row.id} style = {{marginRight:7}} />

                                <img  className = "image" src = {folder} width = "25" height = "25" alt="User Icon" title= "Ver protocolo" 
                                onClick = {() => watchProtocol(row.id, row.fileProtocol)} id={row.id} />
                                </>
                            }
                            {row.lista_prof.includes(parseInt(auth.user.id)) &&
                                <>
                                <img  className = "image" src = {lapiz} width = "25" height = "25" alt="User Icon" title= "Evaluar protocolo" 
                                onClick = {() => verificaEvaluacion(row.id)} id={row.id} style = {{marginRight:7}} />

                                <img  className = "image" src = {folder} width = "25" height = "25" alt="User Icon" title= "Ver protocolo" 
                                onClick = {() => watchProtocol(row.id, row.fileProtocol)} id={row.id} />

                                </>
                            }
                            
                            
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
                    <div className = "title" >Protocolos disponibles</div>
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

            <Modal size = "lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Evaluaci&oacute;n de propuesta de TT</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    
                    <div className="form-check form-switch">
                        {preguntas.map((i, index) =>(
                            <div  className = "row" key = {index}>

                                <div  className = "row">
                                    <div className = "col-12 d-flex justify-content-start ">
                                        <input  name = "key"
                                                className="form-check-input" 
                                                type="checkbox" role="switch"
                                                id = {i.id}
                                                onChange = {handleInputChange}
                                                checked = {i.state}

                                                />
                                        &nbsp;&nbsp;<label className="form-check-label" htmlFor="flexSwitchCheckChecked" style = {{fontSize:14}}><strong>{i.id}.-&nbsp;&nbsp;{i.title}</strong></label>
                                    </div>
                                </div>
                                <div  className = "row">
                                    <div className = "col-12 d-flex justify-content-start ">
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked" style = {{fontSize:14}}>{i.ask}</label>
                                    </div>
                                </div>
                                {i.id === 6 &&
                                    <div  className = "row">
                                        <div className = "col-12 d-flex justify-content-start ">
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked" style = {{fontSize:10}}>
                                            Originalidad, vinculaci&oacute;n con poblaci&oacute;n usuaria potencial, utilidad de los resultados, complejidad en su elaboraci&oacute;n a nivel ingenier&iacute;a, mejoramiento de lo existente, etc.
                                            </label>
                                        </div>
                                    </div>
                                }
                                {i.id === 7 &&
                                    <div  className = "row">
                                        <div className = "col-12 d-flex justify-content-start ">
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked" style = {{fontSize:10}}>
                                            Tiempos, recursos humanos y materiales, alcances, costos y otros puntos que puedan impedir la culminaci&oacute;n exitosa del trabajo.
                                            </label>
                                        </div>
                                    </div>
                                }
                                

                                <div  className = "row" >
                                    <div className = "col-12 d-flex justify-content-start ">
                                        <input  type = "text" id = {i.id} onChange = {handleTextChange} className = "form-control" placeholder = "Observaci&oacute;n"/>
                                    </div>
                                </div>
                            </div>
                            
                        ))}
                    </div>
                    <div  className = "row" style={{marginTop:20}}>
                        <div className = "col-lg-2 col-md-2 col-sm-12">
                            <h6>Dictamen</h6>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-12">
                            
                            <select className = "form-select" 
                                
                                value = {dictamen}
                                onChange = {(e) =>{
                                    setDictamen(e.target.value);
                                }}
                                
                            >
                                <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                                <option  value = "1" >Aprobado</option>
                                <option  value = "0" >No aprobado</option>
                            </select>
                        </div>
                    </div>



                    <div  className = "row" style={{marginTop:20}}>
                        <div className = "col-12 d-flex justify-content-center">
                            <h6>Recomendaciones detalladas</h6>
                        </div>
                    </div>
                    <div  className = "row" >
                        <div className = "col-12 d-flex justify-content-start ">
                            <textarea value = {datos.summary} className = "form-control" name = "summary" rows="3" onChange = {datosInputChange} placeholder = "Recomandaciones"></textarea>
                        </div>
                    </div>
                    
                    

                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={engrane} onClick={generarEvalucacion} width = "25" height = "25" alt="User Icon" title= "Generar evaluaci&oacute;n" />
                    <img className="image" src={cancel} onClick={handleClose} width = "25" height = "25" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>


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


    )}