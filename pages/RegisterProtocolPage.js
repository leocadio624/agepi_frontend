import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import {Modal, Button} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";


import check from '../assetss/images/comprobado.png';
import edit_icon from '../assetss/images/edit.png';
import save from '../assetss/images/save-file.png';
import cancel from '../assetss/images/cancelar.png';
import add from '../assetss/images/plus.png';
import clean from '../assetss/images/iconoBorrar.png';
import search from '../assetss/images/ordenador.png';
import pdf from '../assetss/images/pdf.png';
import firma from '../assetss/images/firma-digital.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function RegisterPage(){

    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [pkTeam, setPkTeam] = useState(0);

    const ref_title = useRef();
    const ref_sumary = useRef();
    const ref_inscripccion = useRef();
    const ref_periodo = useRef();
    const file_ref = useRef();
    

    const countSumary = useRef();
    const form_ref = useRef();

    const [datos, setDatos] = useState({
        pk_protocol  : 0,
        numero       : 'Registro de protocolo',
        title        : '',
        sumary       : '',
        fileProtocol : '',
        fk_protocol_state :1
    })

    
    const [period, setPeriod] = useState('-1');
    const [typeRegister, setTypeRegister] = useState('-1');

    const [periodos, setPeriodos] = useState([]);
    const [inscripcciones, setInscripcciones] = useState([]);
    const [protocolos, setProtocolos] = useState([]);




    const [selectedFile, setSelectedFile] = useState(null);
    const [keyList, setKeyList] = useState( [ {key:""} ] );

    useEffect(() => {
        startModule();
        
    },[]);

    const handleInputChange = (event) => {

        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        if( event.target.name === 'sumary')
            updateContadorTa(ref_sumary.current, countSumary.current, 4000);
        
    }
    const handleAddKey = () => {
        setKeyList([...keyList, {key:""}])
    }

    const handleRemoveKey = (index) => {
        const list = [...keyList];
        list.splice(index, 1);
        setKeyList(list);

    }
    const handleKeyChange = (e, index) =>{
        const {name, value} = e.target;
        const list = [...keyList];
        list[index][name] = value;
        setKeyList(list);

        
        

    }

    function updateContadorTa(ta, contador, max){

        contador.innerHTML = "0/" + max;
        contador.innerHTML = ta.value.length + "/" + max;

        
        if( parseInt(ta.value.length) > max ){
            ta.value = ta.value.substring(0, max-1);
            contador.innetHTML = max + "/" + max;
        }

    }

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
        url: baseURL+'/protocolos/start_module/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },params:{
            pk_user : user.id
        }
        })
        .then(response =>{            
            
            setPeriodos(response.data.periodos);
            setInscripcciones(response.data.inscripcciones);
            setPkTeam(response.data.pk_team);
            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });


    }

    const guardarProtocolo = async (bandera) => {
        
        if(pkTeam === 0){
            auth.swalFire('Para registrar un protocolo debes de estar relacionado en un equipo');
            return;

        }
        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        let indice = 1;


        if(datos.title === ''){
            auth.swalFire('Ingrese un t\u00EDtulo de protocolo');
            ref_title.current.focus()
            return;
        }
        if(datos.sumary === ''){
            auth.swalFire('Ingrese un resumen de protocolo');
            ref_sumary.current.focus()
            return;
        }
        if(parseInt(period) === -1){
            auth.swalFire('Seleccione un per\u00EDodo escolar');
            ref_periodo.current.focus()
            return;
        }
        if(parseInt(typeRegister) === -1){
            auth.swalFire('Seleccione un tipo de registro');
            ref_inscripccion.current.focus()
            return;
        }
        if(selectedFile === null && bandera === 0){
            auth.swalFire('Seleccione el archivo de t\u00FA protocolo en formato PDF');
            file_ref.current.focus()
            return;
        }
        if(keyList.length < 4){
            auth.swalFire('Debe de ingresar al menos 4 palabras clave');
            return;
        }
        keyList.forEach(function(i){ 
            if( (i.key).trim() === ''){
                auth.swalFire('Ingrese el valor de la palabra clave '+(indice)+'');
                return;
            }
            indice += 1
        });


        var keyWords = [];
        keyList.forEach(function(i){ keyWords.push((i.key).trim()) });

        var formData = new FormData( form_ref.current );
        formData.append('pk_user', user.id);
        formData.append('fk_protocol_state', 1);
        formData.append('fk_periodo', period);
        formData.append('fk_inscripccion', typeRegister);
        formData.append('keyWords', keyWords);
        if(bandera === 1)
            formData.append('number', datos.numero);
        if(selectedFile === null && bandera === 1)
            formData.delete('fileProtocol');

        

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
        
        
        let url = bandera === 0 ? baseURL+'/protocolos/protocolos/' : baseURL+'/protocolos/protocolos/'+encodeURI(datos.pk_protocol)+'/';
        let method = bandera === 0 ? 'post' : 'put';
        
        axios({
        method: method,
        url : url, 
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : formData
        })
        .then(response =>{
            
            if(response.status === 226){
                auth.onErrorMessage(response.data.message);
            }else if(response.status === 200){

                
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
                    cleanForm();
                }
                })
                
                
            }
            

        }).catch(error => {
            if(!error.status)
                auth.onError();
                        
        });
        
        
        

        
    }

    /*
    * Descripcion:	Visualiza el archivo de protocolo
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const descargarArchivo = async () => {

        
        if(datos.fileProtocol === ''){
            auth.onError();
            return;
        }

        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        if(response.status === 401){ auth.sesionExpirada(); return;}

        

        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);


        axios({
        method: 'post',
        url: baseURL+'/downloadFile/',
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'pathProtocol'      : datos.fileProtocol
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
                        
        });


    }

    

    /*
    * Descripcion:	Reinicia formulario
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const cleanForm = () => {

        file_ref.current.value = null;
        setSelectedFile(null);
        setDatos({  
                    pk_protocol : 0,
                    numero      : 'Registro de protocolo',
                    title       : '',
                    sumary      : '',
                    fileProtocol : '',
                    fk_protocol_state :1
                });
        countSumary.current.innerHTML = "0/4000";
        setPeriod('-1');
        setTypeRegister('-1');
        setKeyList([{key:""}]);
        setEdit(false);

    }

    

    const pruebas = async () =>{ 
        
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
        url: baseURL+'/protocolos/team/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            pk_team : pkTeam
        }
        })
        .then(response =>{            
            
            handleShow();
            setProtocolos(response.data.protocolo);
            


            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            

        });

    }
    

    /*
    * Descripcion:	Pinta datos de protocolo en vista
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const loadProtocol = async (pk_protocol, number, title, sumary, fk_periodo, fk_inscripccion, fileProtocol, fk_team, fk_protocol_state) =>{ 
        
        

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
            'key': pk_protocol
        }
        })
        .then(response =>{

            let palabras_protocolo = [];
            response.data.forEach(function(i){ palabras_protocolo.push({'key':i.word}) });
            if(palabras_protocolo.length === 0)
                palabras_protocolo.push({'key':''})
            setKeyList(palabras_protocolo);


            setDatos({  
                pk_protocol  : pk_protocol,
                numero       : number,
                title        : title,
                sumary       : sumary,
                fileProtocol : fileProtocol,
                fk_protocol_state :fk_protocol_state
            });

            setPeriod(fk_periodo);
            setTypeRegister(fk_inscripccion);
            setPkTeam(fk_team);
            countSumary.current.innerHTML = ''+(sumary.length).toString()+"/4000";

            //setEdit(false);
            
            
            if(fk_protocol_state > 1)
                setEdit(true);
            else
                setEdit(false);
            

            handleClose();
            

            

        }).catch(error =>{
            if(!error.status)
                auth.onError();
                        
        });

        
    }

    /*
    * Descripcion: Cambia a estado 2 y solicita firmas a los integrantes del equipo
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const solicitaFirmas = async (fk_protocol, fk_team) =>{
        
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
        url: baseURL+'/protocolos/solicta_firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            fk_userOrigen : user.id,
            fk_team:fk_team,
            fk_protocol:fk_protocol
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
                //cleanForm();
                handleClose();
            }
            })

            
            

            

        }).catch(error =>{

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
    const handleClose = () =>{ setShow(false); }
    const handleShow = () =>{ setShow(true); } 
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
    const columProtocolos = [
        {
            name:'N\u00FAmero',
            selector:row => row.number,
            sortable:true,
            center:true
        },
        {
            name:'T\u00EDtulo',
            selector:row => row.title,
            sortable:true,
            center:true
        },
        {
            name:'Estado',
            selector:row => row.estado,
            sortable:true,
            left:true

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
                            <img    className = "image" src = {search} width = "30" height = "30" alt="User Icon" title= "Ver detalle protocolo" 
                                    onClick = {() => loadProtocol(  row.id,
                                                                row.number,
                                                                row.title,
                                                                row.sumary,
                                                                row.fk_periodo,
                                                                row.fk_inscripccion,
                                                                row.fileProtocol,
                                                                row.fk_team,
                                                                row.fk_protocol_state
                                                                )} style = {{marginRight:7}}/>

                            {row.fk_protocol_state === 1 &&
                                <img    className="image" src={firma} onClick = {() => solicitaFirmas(row.id, row.fk_team)} 
                                width = "30" height = "30" alt="User Icon"
                                title= "Solicitar firmas a integrantes" style = {{marginRight:7}}/>
                            }
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];
    return(
        
        <div>
        {periodos.length !== 0 && inscripcciones.length !== 0 &&
        <>
        <div className = "container panel shadow">
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >{datos.numero}</div>
                </div>
            </div>
            
            <form ref={form_ref}  encType="multipart/form-data">
                <div className= "row row-form" >
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >T&iacute;tulo</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6"> 
                        <input ref={ref_title} value = {datos.title} className = "form-control" type="text" name = "title" placeholder = "T&iacute;tulo de protocolo" onChange = {handleInputChange} readOnly = {edit} />
                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Resumen</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <textarea  ref={ref_sumary}  value = {datos.sumary} className = "form-control" name = "sumary" rows="3" onChange = {handleInputChange} readOnly = {edit} ></textarea>
                        <blockquote className="blockquote text-center">
                            <p  ref={countSumary} className = "mb-0 font-weight-lighter" style ={{fontSize:13}} >0/4000</p>
                        </blockquote>
                        <blockquote className="blockquote text-center">
                            <footer className="blockquote-footer font-weight-lighter" style ={{fontSize:13}} >M&aacute;ximo 4000 car&aacute;cteres</footer>
                        </blockquote>
                    </div>
                </div>
                <div className = "row row-form">
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Per&iacute;odo escolar</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                    
                        <select className = "form-select" 
                            value = {period}
                            ref={ref_periodo}
                            onChange = {(e) =>{
                                setPeriod(e.target.value);
                            }}
                            disabled = {edit}
                            
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            {periodos.map((obj, index) =>(
                                <option key = {index} value = {obj.id} >{obj.periodo}</option>
                            ))}
                        </select>

                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Tipo de registro</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <select className = "form-select"
                            value = {typeRegister}
                            ref={ref_inscripccion}
                            onChange = {(e) =>{
                                setTypeRegister(e.target.value);
                            }}
                            disabled = {edit}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            {inscripcciones.map((obj, index) =>(
                                <option key = {index} value = {obj.id} >{obj.descp}</option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className = "row row-form">
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Archivo</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <input className = "form-control" ref = {file_ref} name = "fileProtocol" type="file" readOnly = {edit}
                            onChange = {(e) => {

                                const nameFile = e.target.files[0].name;
                                const sizeFile = e.target.files[0].size;
                                
                                if(nameFile.toLowerCase().match(/([^\s]*(?=\.(pdf))\.\2)/gm)!=null){                                
                                    if(sizeFile <= 10485760){
                                                    
                                        setSelectedFile(e.target.files[0]);
                                        
                                    }else{

                                        Swal.fire({
                                        icon: 'info',
                                        html : "El archivo no puede ser mayor a 10 MB",
                                        showCancelButton: false,
                                        focusConfirm: false,
                                        allowEscapeKey : false,
                                        allowOutsideClick: false,
                                        confirmButtonText:'Aceptar',
                                        confirmButtonColor: '#39ace7',
                                        preConfirm: () => {
                                            file_ref.current.value = null;
                                            setSelectedFile(null);
                                            
        
                                        }
                                        })
                                    }
                                }else{
                                    
                                    Swal.fire({
                                    icon: 'info',
                                    html : 'El formato del archivo debe ser PDF',
                                    showCancelButton: false,
                                    focusConfirm: false,
                                    allowEscapeKey : false,
                                    allowOutsideClick: false,
                                    confirmButtonText:'Aceptar',
                                    confirmButtonColor: '#39ace7',
                                    preConfirm: () => {
                                        file_ref.current.value = null;
                                        setSelectedFile(null);

                                    }
                                    })
                                }


                            }} 
                        />
                    </div>
                </div>
            </form>

            <form className = "" autoComplete = "off">
                <div className = "">

                    <div className = "row row-form">
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Palabra(s) clave</div>
                        </div>
                    </div>
                    
                    {keyList.map((singleKey, index) =>(

                        <div key = {index} className = "row" >
                            <div className = "col-3" style = {{marginTop:5}} >
                                <input name = "key" className = "form-control" type = "text" id = "key" required
                                value = {singleKey.key}
                                onChange = {(e) => handleKeyChange(e, index)}
                                readOnly = {edit}
                                />
                                {keyList.length - 1 === index && keyList.length < 4 && edit === false &&(
                                    <img className="image2" src={add} onClick = {handleAddKey} width = "30" height = "30" alt="User Icon" title= "Agregar palabra clave" />
                                )}
                            </div>
                            <div className = "col-3" >
                                {keyList.length > 1 && edit === false && (
                                    <img className="image2" src={cancel} onClick = {() => handleRemoveKey(index)} width = "30" height = "30" alt="User Icon" title= "Quitar palabra clave" />
                                )}
                            </div>
                        </div>

                    ))}

                </div>
            </form>


            <div className = "row panel-footer" style = {{marginTop:20}}>
                <div className = "col-12 d-flex justify-content-center">
                    {edit === true &&
                    <>
                        {datos.fk_protocol_state === 1 &&
                            <img className="image" src={save} onClick = {() => guardarProtocolo(1)} width = "30" height = "30" alt="User Icon" title= "Guardar protocolo" style = {{marginRight:5}}/>
                        }
                    <img className="image" src={pdf} onClick = {descargarArchivo} width = "30" height = "30" alt="User Icon" title= "Ver archivo de protocolo" style = {{marginRight:5}}/>
                    </>
                    }
                    {edit === false &&
                    <>
                    <img className="image" src={check} onClick = {() => guardarProtocolo(0)} width = "30" height = "30" alt="User Icon" title= "Crear registro de protocolo" style = {{marginRight:5}}/>
                    </>
                    
                    }
                    <img className="image" src={edit_icon} onClick = {pruebas} width = "30" height = "30" alt="User Icon" title= "Ver protocolo" style = {{marginRight:5}}/>
                    <img className="image" src={clean} onClick = {cleanForm} width = "35" height = "35" alt="User Icon" title= "Limpiar campos" />
                </div>
            </div>
        
            <Modal size = "lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Protocolo registrado</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DataTable
                        columns = {columProtocolos}
                        data = {protocolos}
                        title = ""
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                    
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={cancel} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>



        </div>
        </>
        }
        { periodos.length === 0 && inscripcciones.length === 0 &&
        
            <div className = "row" style = {{marginTop:40}}>
                <div className = "col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                    <div className = "alert alert-info" role="alert" >
                        Aun no hay un per&iacute;odo de registro de protocolo abierto
                    </div>
                </div>
            </div>
        
        }
        { periodos.length === 0 ^ inscripcciones.length === 0 &&
        
            <div className = "row" style = {{marginTop:40}}>
                <div className = "col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                    <div className = "alert alert-info" role="alert" >
                        Aun no hay un per&iacute;odo de registro de protocolo abierto
                    </div>
                </div>
            </div>
        
        }


        </div>

        
        
    )
}