import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {Modal, Spinner} from 'react-bootstrap';
import Swal from 'sweetalert2';

import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";

import add from '../assetss/images/plus.png';
import save from '../assetss/images/save-file.png';
import check from '../assetss/images/comprobado.png';
import cancel from '../assetss/images/cancelar.png';
import delete_icon from '../assetss/images/delete.png';
import edit_icon from '../assetss/images/lapiz.png';
import faq from '../assetss/images/faq.png';
import warning from '../assetss/images/warning.png';


const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterTeam(){

    const auth = useAuth();
    const [transaction, setTransaction] = useState(false);
    const name_team = useRef();

    const [datos, setDatos] = useState({name_team:''});

    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [estado, setEstado] = useState(false);


    const [teams, setTeams] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);



    useEffect(() => {
        startModule();
    },[]);

    /*
    * Descripcion:	Actualiza en el campo de entrada el campo nombre de equipo
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        setEstado(false);
        
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
            name:'Nombre',
            selector:row => row.nombre,
            sortable:true,
            center:true
        },
        {
            name:'Fecha creaci\u00F3n',
            selector:row => row.created_date,
            sortable:true,
            center:true
        },
        {
            name:'Integrantes',
            selector:row => row.integrantes,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>

                            <img  className = "image" src = {edit_icon} width = "30" height = "30" alt="User Icon" title= "Editar equipo" 
                                onClick = {() => editTeamHandler(row.id)} id={row.id} />

                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar equipo" 
                                onClick = {() => deleteTeamHandler(row.id)}/>

                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const columAlumnos = [
        {
            name:'Boleta',
            selector:row => row.boleta,
            sortable:true,
            center:true
        },
        {
            name:'Nombre',
            selector:row => row.name+' '+row.last_name,
            sortable:true,
            center:true
            
        },
        {
            name:'Correo electr\u00F3nico',
            selector:row => row.email,
            sortable:true,
            center:true
        },
        {
            name:'Programa academico',
            selector:row => row.programa,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  
                        <>
                            {row.periodo_escolar === 1 &&
                                <>
                                {solicitudes.includes(row.pk_user) === true &&
                                    <img    className = "image" src = {cancel} width = "30" height = "30" alt="User Icon" title= "Cancelar solicitud de equipo" 
                                            onClick = {() => cancelarSolicitud(row.pk_user)  }
                                    />

                                }       
                                {solicitudes.includes(row.pk_user) === false &&
                                    <img  className = "image" src = {check} width = "30" height = "30" alt="User Icon" title = "Enviar solicitud de equipo" 
                                    onClick = {() => enviarSolicitud(row.pk_user)  }
                                    />
                                }
                                </>
                            }
                            {row.periodo_escolar === 0 &&
                                <img    className = "image" src = {faq} width = "25" height = "25" alt="User Icon" title = "Aun no hay un per&iacute;odo de inscripcci&oacute;n abierto" />
                            }
                        </>
                            
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];
    const columProfesores = [
        {
            name:'Numero de empleado',
            selector:row => row.noEmpleado,
            sortable:true,
            center:true
        },
        {
            name:'Nombre',
            selector:row => row.name+' '+row.last_name,
            sortable:true,
            center:true
            
        },
        {
            name:'Correo electr\u00F3nico',
            selector:row => row.email,
            sortable:true,
            center:true
        },
        {
            name:'Academia',
            selector:row => row.academia,
            sortable:true,
            center:true

        },
        {
            name:'Solicitudes disponibles',
            selector:row => row.solicitudes_disp,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>
                            {/*Eciste un periodo escolar*/}
                            {row.periodo_escolar === 1 &&
                                <>
                                {row.solicitudes_disp !== 0 &&
                                    <>
                                    {solicitudes.includes(row.pk_user) === true &&
                                        <img    className = "image" src = {cancel} width = "25" height = "25" alt="User Icon" title= "Cancelar solicitud de equipo" 
                                                onClick = {() => cancelarSolicitud(row.pk_user)  }
                                                
                                        />
                                        
                                    }       
                                    {solicitudes.includes(row.pk_user) === false &&
                                        <img    className = "image" src = {check} width = "25" height = "25" alt="User Icon" title = "Enviar solicitud de equipo" 
                                                onClick = {() => enviarSolicitud(row.pk_user)  }
                                        />
                                    }
                                    </>
                                }                                
                                {row.solicitudes_disp === 0 &&                                    
                                    <img    className = "image" src = {warning} width = "25" height = "25" alt="User Icon" title= "Este profesor ya no puede aceptar solicitudes de protocolo"  />
                                }
                                </>
                            }
                            {row.periodo_escolar === 0 &&
                                <img    className = "image" src = {faq} width = "25" height = "25" alt="User Icon" title = "Aun no hay un per&iacute;odo de inscripcci&oacute;n abierto" />
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
    * Fecha de la creacion:		17/04/2022
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

        beginTransaction();
        axios({
        method: 'get',
        url: baseURL+'/teams/alumno_team/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        })
        .then(response =>{

            endTransaction();
            setTeams(response.data.teams);
            setSolicitudes(response.data.solicitudes)
            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);
            

            

        }).catch(error => {
            endTransaction();
            auth.onError();
            
        });

    }



    /*
    * Descripcion:	Actualiza el estado de el equipo registrado
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const updTableTeam = async () => {

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
        url: baseURL+'/teams/team_list/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        })
        .then(response =>{
            endTransaction();
            setTeams(response.data);

            

        }).catch(error => {

            endTransaction();
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
                        
        });

            
    }
    

    
    
    /*
    * Descripcion:	Envia solicitud de equipo a un alumno
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const enviarSolicitud = async (id) =>{
        
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
        url: baseURL+'/teams/alumno_team/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
        id          : user.id,
        fk_user     : id
        }
        })
        .then(response =>{

            endTransaction();
            if(response.status === 206){
                auth.swalFire(response.data.message);

            }else{
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
                }).then(function() {
                    setSolicitudes(response.data.solicitudes);
                })

            }
            
            
        }).catch(error => {
            endTransaction();

        });




    }
    /*
    * Descripcion:	Cancela una solicitud de equipo enviada
    * Fecha de la creacion:		22/04/2022
    * Author:					Eduardo B 
    */
    const cancelarSolicitud = async (pk_user) =>{

        
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

        /*
        data:{
        id          : user.id,
        fk_user     : id
        }
        */
        
        beginTransaction();
        axios({
        method: 'delete',
        url: baseURL+'/teams/alumno_team/'+encodeURIComponent(pk_user)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        })
        .then(response =>{
            endTransaction();
            if(response.status === 206){
                auth.swalFire(response.data.message);
            }
            else if(response.status === 200){
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
                }).then(function() {
                    setSolicitudes(response.data.solicitudes);
                })


            }
                        
        }).catch(error => {
            endTransaction();
        });

        



        
    }
    /*
    * Descripcion:	Borra el equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const deleteTeamHandler = async (id) =>{


        const  user = JSON.parse(localStorage.getItem('user'));    
        var response = null;
        try {
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        beginTransaction();
        axios({
        method: 'delete',
        url: baseURL+'/teams/teams/'+encodeURIComponent(id)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
            
        })
        .then(response =>{
            endTransaction();
            if(response.status === 226){
                auth.swalFire(response.data.message);
            }else if(response.status === 200){

                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
                }).then(function() {
                    updTableTeam();
                })
                
               
            }
            

        }).catch(error => {

            endTransaction();
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            

        });
    }
    /*
    * Descripcion:	Edita el nombre del equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const editTeamHandler = async (id) =>{

        const  user = JSON.parse(localStorage.getItem('user'));    
        var response = null;
        try {
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        beginTransaction();
        axios({
        method: 'get',
        url: baseURL+'/teams/teams/'+encodeURIComponent(id)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }  
        })
        .then(response =>{
            endTransaction();
            setDatos({name_team:response.data.nombre});
            setEdit(true);


        }).catch(error => {
            endTransaction();
            if(!error.status)
                auth.onError();
            
                        
        });



    }

    /*
    * Descripcion:	Crea el equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const handleSave = async () =>{

        
        if(datos.name_team.trim() === ''){
            setEstado(true);
            return;
        }
        const  user = JSON.parse(localStorage.getItem('user'));    
        var response = null;
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        beginTransaction();
        axios({
        method: 'post',
        url: baseURL+'/teams/teams/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'fk_user'   : user.id,
            'nombre'    : datos.name_team.trim()
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
                updTableTeam();
                setDatos({name_team:''});
            }
            })
                 
        }).catch(error => {
            endTransaction();
            setDatos({name_team:''});
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);    
        });
        
    }
    /*
    * Descripcion:	Actualiza el nombre del equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const handleUpdate = async () =>{

        if(datos.name_team.trim() === ''){
            setEstado(true);
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
        let team = teams[0];

        beginTransaction();
        axios({
        method: 'put',
        url: baseURL+'/teams/teams/'+encodeURIComponent(team.id)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'id'        : team.id,
            'fk_user'   : team.fk_user,
            'nombre'    : datos.name_team.trim()
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

                setEdit(false);
                setDatos({name_team:''});
                updTableTeam();

            }
            })
            
                 
        }).catch(error => {
            endTransaction();
            setEdit(false);
            setDatos({name_team:''});

            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
            
        });
        
    }
    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{ 
        setShow(false);
        setEdit(false);
        setDatos({name_team:''});
  
    } 
    const handleShow = () =>{ 
        setShow(true);
        setEdit(false);
    }
    const beginTransaction = () =>{ setTransaction(true); }
    const endTransaction = () =>{ setTransaction(false); }
    return(
        
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Administraci&oacute;n de equipo de protocolo</div>
                </div>
            </div>

            <div className = "row">
                
                <div className = "col-12 d-flex justify-content-start">
                    <img className="image" src={add}  onClick={handleShow} width = "40" height = "40" alt="User Icon" title= "Crear equipo" style = {{marginLeft:35}}/>
                </div>
            </div>

            <div className= "row row-form" >
                <div className = "col-lg-12">
                <Tabs defaultActiveKey="alumnos" id="uncontrolled-tab-example" className="mb-3" style = {{marginTop:30}}>
                    <Tab eventKey="alumnos" title="Alumnos">

                        <DataTable
                        columns = {columAlumnos}
                        data = {alumnos}
                        title = "Alumnos disponibles"
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                        />
                        </Tab>
                    <Tab eventKey="profesores" title="Profesores">
                        <DataTable
                        columns = {columProfesores}
                        data = {profesores}
                        title = "Profesores disponibles"
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                        />
                    </Tab>
                </Tabs>
                </div>
            </div>

            
        


                <Modal size="lg" show={show} onHide={handleClose}>
                    <Modal.Header closeButton  className = "bg-primary" >
                        <Modal.Title >
                            <div className = "title" >Registro equipo</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    
                    
                        <div className= "row" >
                            <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                                <div className = "label-form" >Nombre</div>
                            </div>
                            
                            
                            <div className = "col-lg-4 col-md-4 col-sm-6"> 
                                <input  type = "text" 
                                        className = "form-control" 
                                        ref = {name_team}
                                        name = "name_team" 
                                        value = {datos.name_team}
                                        placeholder = "Nombre de equipo" 
                                        onChange = {handleInputChange} 
                                        autoFocus
                                        required
                                />
                            </div>
                            <div className = "col-lg-6 col-md-6 col-sm-12"> 
                                {estado === true &&
                                <div className = "alert alert-danger" role="alert" >
                                    Por favor ingrese un nombre de equipo
                                </div>
                                }
                            </div>
                        </div>

                    <div className= "row row-form" >
                        <div className = "col-lg-12">

                            <DataTable
                            columns = {columnas}
                            data = {teams}
                            title = "Equipo"
                            noDataComponent="No existen registros disponibles"
                            pagination
                            paginationComponentOptions = {paginacionOpcciones}
                            fixedHeaderScrollHeight = "600px"
                            />

                        </div>

                    </div>
                        
                    </Modal.Body>
                    <Modal.Footer className = "panel-footer">
                        
                        
                        {edit === true &&
                            <img className="image" src={save} onClick={handleUpdate} width = "30" height = "30" alt="User Icon" title= "Guardar cambios" />
                        }
                        {edit === false &&
                            <img className="image" src={check} onClick={handleSave} width = "30" height = "30" alt="User Icon" title= "Crear equipo" />
                        }
                        <img className="image" src={cancel} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" /> 
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

    )
}