import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
//import TabContainer from 'react-bootstrap/TabContainer';

import Swal from 'sweetalert2';

import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";


import addUser from '../assetss/images/perfiles-de-usuario.png';
import goma from '../assetss/images/iconoBorrar.png';
import save from '../assetss/images/save-file.png';
import delete_icon from '../assetss/images/delete.png';
import edit_icon from '../assetss/images/lapiz.png';
const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ComunidadPage(){

    const boleta = useRef();
    const email_al = useRef();
    const programa = useRef();

    const auth = useAuth();
    const [programas, setProgramas] = useState([]);

    const [alumno, setAlumno] = useState({'id':0, 'boleta':'', 'email_al':'', 'programa':'-1'});
    const [editAlum, setEditAlum] = useState(false);
    const [estado, setEstado] = useState({error:false, message_error:''})

    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);

    useEffect(() => {
        programasAcademicos();
        loadTables();
        
    },[]);

    const handleInputChange = (event) => {
        setAlumno({
            ...alumno,
            [event.target.name]:event.target.value
        })
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
    const columAlumnos = [
        {
            name:'Boleta',
            selector:row => row.boleta,
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
            name:'Programa acad\u00E9mico',
            selector:row => row.programaAcademico,
            sortable:true,
            center:true

        },
        {
            name:'Estado',
            selector:row => row.estado,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>

                            <img  className = "image" src = {edit_icon} width = "30" height = "30" alt="User Icon" title= "Editar alumno" 
                                onClick = {() => setAlumnForm(row.id, row.boleta, row.email, row.fk_programaAcademico)  }  />
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar alumno" 
                                onClick = {() => deleteAlumno(row.id)}/>

                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    

    const columProfesores = [
        {
            name:'N\u00FAmero de empleado',
            selector:row => row.noEmpleado,
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
            name:'Departamento',
            selector:row => row.departamento,
            sortable:true,
            center:true

        },
        {   

            name:'Acciones',
            cell:(row) =>  <>
                            <img  className = "image" src = {edit_icon} width = "30" height = "30" alt="User Icon" title= "Editar profesor" 
                            />
                            
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar profesor" 
                            />


                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    /*
    * Descripcion:	Carga catalogo de programas academicos disponibles
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const programasAcademicos = async () =>{ 
        
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

    
        axios({
            method: 'get',
            url: baseURL+'/comunidad/programa_academico/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(response =>{

            setProgramas(response.data);
            
            
        }).catch(error => {

            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
        });

    }



    /*
    * Descripcion:	Refresca tabla de alumnos y profesores
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const loadTables = async () =>{ 
        
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

    
        axios({
            method: 'get',
            url: baseURL+'/comunidad/comunidad/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(response =>{

            
            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);

            
        }).catch(error => {

            if(!error.status){
               auth.onError()
               setAlumnos([]);
               setProfesores([]);
            }
            auth.onErrorMessage(error.response.data.message);
            
        });

    }
    /*
    * Descripcion:	Refresca tabla de alumnos
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const loadAlumnos = async () =>{ 
        
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

    
        axios({
            method: 'get',
            url: baseURL+'/comunidad/alumnos/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(response =>{
            setAlumnos(response.data.alumnos);
            
            
        }).catch(error => {
            if(!error.status){
               auth.onError()
               setAlumnos([]);
            }
            auth.onErrorMessage(error.response.data.message);
            
        });

    }
    /*
    * Descripcion:	Actualiza registro de alumno
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const guardarAlumno = async () =>{

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        let RegExPatternAlumno = /^[\w-\.]{3,}@alumno.ipn\.mx$/;
        let RegExPatternProfesor = /^[\w-\.]{3,}@ipn\.mx$/;
        
        
        if( alumno.boleta.trim() === ''){
            setEstado( {error:true, message_error:'Ingrese un numero de boleta'} )
            boleta.current.focus();
            return;
        }
        else if( alumno.email_al.trim() === ''){
            setEstado( {error:true, message_error:'Ingrese un correo electr\u00F3nico institucional'} )
            email_al.current.focus();
            return;
        }
        else if( (alumno.email_al).match(RegExPatternAlumno) == null && (alumno.email_al).match(RegExPatternProfesor) == null ){
            setEstado( {error:true, message_error:'El correo electr\u00F3nico no es institucional'} )
            email_al.current.focus();
            return;
        }
        else if( Array.isArray( alumno.email_al.match(RegExPatternAlumno)) === false ){
            setEstado( {error:true, message_error:'El correo electr\u00F3nico institucional no es de tipo alumno'} )
            email_al.current.focus();
            return;
        }
        else if( alumno.programa === '-1' ){
            setEstado( {error:true, message_error:'Seleccione un programa acad\u00E9mico'} )
            programa.current.focus();
            return;
        }
        setEstado({error:false, message_error:''});

        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
      
        
        axios({
        method: 'put',
        url: baseURL+'/comunidad/alumnos/'+encodeURIComponent(alumno.id)+'/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'fk_programa'        : alumno.programa,
            'email'   : alumno.email_al,
            'boleta'    : alumno.boleta
        }
        })
        .then(response =>{

            
            if(response.status === 226 && response.data.campo === 'email' ){
                setEstado({error:true, message_error:response.data.message});
                email_al.current.focus();

            }else if(response.status === 226 && response.data.campo === 'boleta'){
                setEstado({error:true, message_error:response.data.message});
                boleta.current.focus();

            }else{

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
                    
                    loadAlumnos();
                    resetFormAlumn();
    
    
                }
                })
            }
            
            
                 
        }).catch(error => {
            
            resetFormAlumn();
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
            
            
        });

    }
    
    /*
    * Descripcion:	Reinicia formulario
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const resetFormAlumn = () => {
        setAlumno({'id':0, 'boleta':'', 'email_al':'', 'programa':-1});
        setEditAlum(false);
        setEstado({error:false, message_error:''});
    }
    /*
    * Descripcion:	Setea alumno en formulario desde tabla
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const setAlumnForm = (id, boleta, email, programa) => {

        setEditAlum(true);
        setAlumno({'id':id, 'boleta':boleta, 'email_al':email, 'programa':programa});
        

    }
    /*
    * Descripcion:	Borra de manera logica a un alumno
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const deleteAlumno = async (id) =>{ 

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


        Swal.fire({
        title: '',
        text: "\u00bfDesea eliminar este alumno\u003F",
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
                url: baseURL+'/comunidad/alumnos/'+encodeURIComponent(id)+'/',
                headers: {
                    'Authorization': `Bearer ${ token }`
                }
                })
                .then(response =>{
                    
                    Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                    }).then(function() {
                        loadAlumnos();
                    })
            
                }).catch(error => {
        
                    if(!error.status)
                        auth.onError()
                    auth.onErrorMessage(error.response.data.message);
                    
                                
                });


            }//end-if
        })

    }
    /*
    * Descripcion:	Agrega un alumno para poder registrarce en la aplicacion
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const addAlumno = async () =>{ 

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        let RegExPatternAlumno = /^[\w-\.]{3,}@alumno.ipn\.mx$/;
        let RegExPatternProfesor = /^[\w-\.]{3,}@ipn\.mx$/;
        
        
        if( alumno.boleta.trim() === ''){
            setEstado( {error:true, message_error:'Ingrese un numero de boleta'} )
            boleta.current.focus();
            return;
        }
        else if( alumno.email_al.trim() === ''){
            setEstado( {error:true, message_error:'Ingrese un correo electr\u00F3nico institucional'} )
            email_al.current.focus();
            return;
        }
        else if( (alumno.email_al).match(RegExPatternAlumno) == null && (alumno.email_al).match(RegExPatternProfesor) == null ){
            setEstado( {error:true, message_error:'El correo electr\u00F3nico no es institucional'} )
            email_al.current.focus();
            return;
        }
        else if( Array.isArray( alumno.email_al.match(RegExPatternAlumno)) === false ){
            setEstado( {error:true, message_error:'El correo electr\u00F3nico institucional no es de tipo alumno'} )
            email_al.current.focus();
            return;
        }
        else if( alumno.programa === '-1' ){
            setEstado( {error:true, message_error:'Seleccione un programa acad\u00E9mico'} )
            programa.current.focus();
            return;
        }
        setEstado({error:false, message_error:''});
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        
      
        
        axios({
        method: 'post',
        url: baseURL+'/comunidad/alumnos/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'fk_user'       : 0,
            'alta_app'      : false,
            'email'         : alumno.email_al.trim(),
            'boleta'        : alumno.boleta.trim(),
            'fk_programa'   : alumno.programa
        }
        })
        .then(response =>{

            if(response.status === 226 && response.data.campo === 'email' ){
                setEstado({error:true, message_error:response.data.message});
                email_al.current.focus();

            }else if(response.status === 226 && response.data.campo === 'boleta'){
                setEstado({error:true, message_error:response.data.message});
                boleta.current.focus();

            }else{
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data.message,
                showConfirmButton: false,
                timer: 1500
                }).then(function() {
                    loadAlumnos();
                    resetFormAlumn();
                })
            }
            
            

                 
        }).catch(error => {
            
            resetFormAlumn();
            if(!error.status)
                auth.onError()
                
        });



    }
    return(
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >

            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Control de acceso</div>
                </div>
            </div>

            
            <Tabs defaultActiveKey="alumnos" id="uncontrolled-tab-example" className="mb-3" style = {{marginTop:30}}>
                <Tab eventKey="alumnos" title="Alumnos">

                    
                    {estado.error === true  &&
                        <div className = "row" style = {{marginTop:30}} >
                            <div className = "col-12">
                                <div className = "alert alert-danger" role="alert" >
                                    {estado.message_error}
                                </div>
                            </div>
                        </div>
                    }


                    <div className= "row" style = {{marginTop:30}} >
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Boleta</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6"> 
                            <input className = "form-control" type="text" ref = {boleta} name = "boleta" value = {alumno.boleta} placeholder = "N&uacute;mero de boleta" onChange = {handleInputChange} disabled = {editAlum} />
                        </div>
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Correo electr&oacute;nico</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6">
                            <input className = "form-control" type="text" ref = {email_al} name = "email_al" value = {alumno.email_al} placeholder = "Correo electr&oacute;nico institucional" onChange = {handleInputChange} />
                        </div>
                    </div>
                    <div className= "row " style = {{marginTop:30}}>
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Programa acad&eacute;mico</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6"> 

                            {/*
                            <div> {JSON.stringify(programas)} </div>
                            */}
                            
                            <select className = "form-select" ref = {programa} name = "programa"  onChange = {handleInputChange} value = {alumno.programa}>
                                <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                                {programas.map((obj, index) =>(
                                    <option key = {index} value = {obj.id} >{obj.programa}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className = "row" style = {{marginTop:30}}>
                        <div className = "col-12 d-flex justify-content-center">
                            
                            {editAlum === false &&  
                            <img className="image" src={addUser}  width = "30" height = "30" alt="User Icon" title= "Agregar alumno" onClick={addAlumno} />
                            }
                            {editAlum === true &&
                                <img className="image" src={save}  width = "30" height = "30" alt="User Icon" title= "Guardar cambios" style = {{marginLeft:5}} 
                                    onClick={guardarAlumno}
                                />
                            }
                            <img    className="image" src={goma}  width = "40" height = "40" alt="User Icon" title= "Limpiar campos" style = {{marginLeft:5}}
                                    onClick={resetFormAlumn}
                            />


                        </div>
                    </div>
                    <div className= "row" style = {{marginTop:60}}>
                        <div className= "col-12" >
                            <DataTable
                                columns = {columAlumnos}
                                data = {alumnos}
                                title = "Alumnos con acceso"
                                pagination
                                paginationComponentOptions = {paginacionOpcciones}
                                fixedHeaderScrollHeight = "600px"
                            />
                        </div>
                    </div>


                </Tab>
                <Tab eventKey="profesores" title="Profesores">
                    <DataTable
                        columns = {columProfesores}
                        data = {profesores}
                        title = "Alumnos con acceso"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                </Tab>
            </Tabs>            
        </div>
    )
}