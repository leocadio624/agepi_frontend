import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
//import TabContainer from 'react-bootstrap/TabContainer';

import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";


import addUser from '../assetss/images/perfiles-de-usuario.png';
import goma from '../assetss/images/iconoBorrar.png';
import cancel from '../assetss/images/cancelar.png';
import save from '../assetss/images/save-file.png';
import delete_icon from '../assetss/images/delete.png';
import edit_icon from '../assetss/images/lapiz.png';
import excel from '../assetss/images/excel.png';
import aprobado from '../assetss/images/aprobado.png';
import advertencia from '../assetss/images/warning.png';
import engrane  from '../assetss/images/engrane.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ComunidadPage(){

    const boleta = useRef();
    const email_al = useRef();
    const programa = useRef();

    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [showProf, setShowProf] = useState(false);
    const [programas, setProgramas] = useState([]);

    const [alumno, setAlumno] = useState({'id':0, 'boleta':'', 'email_al':'', 'programa':'-1'});
    const [editAlum, setEditAlum] = useState(false);
    const [estado, setEstado] = useState({error:false, message_error:''})

    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);

    

    const [alEmails, setAlEmails] = useState([]);
    const [alBols, setAlBols] = useState([]);
    const [cargaAlumnos, setCargaAlumnos] = useState([]);
    const [cargaProfesores, setCargaProfesores] = useState([]);
    
    


    useEffect(() => {
        startModule();
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
            name:'N\u00FAmero empleado',
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
            name:'Programa academico',
            selector:row => row.academia,
            sortable:true,
            center:true

        },
        {
            name:'Estado',
            selector:row => row.estado,
            sortable:true,
            center:true

        }/*,
        {   

            name:'Acciones',
            cell:(row) =>  
                            {row.fk_user === 0 &&
                            <>
                            <img  className = "image" src = {edit_icon} width = "30" height = "30" alt="User Icon" title= "Editar profesor" />
                            
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar profesor" />
                            </>
                            }
            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        */
    ];
    const columCargaAlumnos = [
        {
            name:'Boleta',
            selector:row => row.boleta,
            sortable:true,
            center:true
        },
        {
            name:'Correo electr\u00F3nico',
            selector:row => row.correo,
            sortable:true,
            center:true
        },
        {
            name:'Programa academico',
            selector:row => getPrograma(row.programa_academico),
            sortable:true,
            center:true

        },
        { 
            name:'Estado',
            cell:(row) =>  <>
                            {row.estado == 1 &&
                                <img  className = "image" src = {aprobado} width = "20" height = "20" alt="User Icon" title= "Usuario validado"
                                />

                            }
                            {row.estado == 0 &&
                                <img  className = "image" src = {advertencia} width = "20" height = "20" alt="User Icon" title= {row.error} 
                                />
                            
                            }
                            </>
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }  
    ];
    /*
    * Descripcion:	Mapea valor de programa acdaemico
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    function getPrograma(programa){
        
        if(programa === 1)
            return "ISC";
        else if(programa === 2)
            return "Ingenieria en ciencia de datos";
        else if(programa === 3)
            return "Ingenieria en inteligencia artificial";
        else
            return "No disponible";
    
    }
    const columnCargaProfesores = [
        {
            name:'N\u00FAmero empleado',
            selector:row => row.no_empleado,
            sortable:true,
            center:true
        }
        ,
        {
            name:'Correo electr\u00F3nico',
            selector:row => row.correo,
            sortable:true,
            center:true
        },
        {
            name:'Academia',
            selector:row => getAcademia(row.academia),
            sortable:true,
            center:true

        },
        {   
            name:'Estado',
            cell:(row) =>  <>
                            {row.estado == 1 &&
                                <img  className = "image" src = {aprobado} width = "20" height = "20" alt="User Icon" title= "Usuario validado"
                                />

                            }
                            {row.estado == 0 &&
                                <img  className = "image" src = {advertencia} width = "20" height = "20" alt="User Icon" title= {row.error} 
                                />
                            }
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
        
    ];
    /*
    * Descripcion:	Mapea valor de la academia
    * Fecha de la creacion:		05/06/2022
    * Author:					Eduardo B 
    */
    function getAcademia(pk_academia){
        
        if(pk_academia === 1)
            return "Ciencias básicas";
        else if(pk_academia === 2)
            return "Ciencias sociales";
        else if(pk_academia === 3)
            return "Proyectos estratégicos y toma de decisiones";
        else if(pk_academia === 4)
            return "Ciencias de la computación";
        else if(pk_academia === 5)
            return "Ingenieria de software";
        else if(pk_academia === 6)
            return "Sistemas distribuidos";
        else if(pk_academia === 7)
            return "Sistemas digitales";
        else if(pk_academia === 8)
            return "Fundamentos de sistemas eléctricos";
        else
            return "No disponible";
    
    }


    
    

    

    /*
    * Descripcion:	Inicia modulo cargando catalogos
    * y datos de entrada
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

    
        axios({
        method: 'get',
        url: baseURL+'/comunidad/programa_academico/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
        })
        .then(response =>{

            setProgramas(response.data.programas);
            setAlEmails(response.data.al_emails);
            setAlBols(response.data.al_boletas);
            
            
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
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        

        //response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        //if(response.status === 401){ auth.sesionExpirada(); return;}

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
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }

        response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
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
            if(response.status === 401){ auth.sesionExpirada(); return;}
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
    /*
    * Descripcion:	Convierte cvc a array
    * Fecha de la creacion:		29/05/2022
    * Author:					Eduardo B 
    */
    const processCSV = (str, delim=',') => {
        
        const rows = str.slice(str.indexOf('\n')+1).split('\n');
        let RegExPatternAlumno = /^[\w-\.]{3,}@alumno.ipn\.mx$/;

        let arr_alum = []
        let arrProgramas = [1, 2, 3]
        rows.map( row => {
            if(row !== ''){
                const values = row.split(',');
                arr_alum.push({'boleta':values[0].trim(), 'correo':values[1].trim(), 'programa_academico':parseInt(values[2].trim()), 'estado':1, 'error':''})
            }
        })

        arr_alum.forEach(function(i){ 
            if( alBols.includes(i.boleta) || alEmails.includes(i.correo) ){
                i.estado = 0;
                i.error = 'Usuario registrado previamente';
            }
            if( arrProgramas.includes(i.programa_academico) === false ){
                i.estado = 0;
                i.error = 'Los programas academicos son los siguientes: 1-ISC, 2-Ingenier\u00EDa en ciencia de datos, 3-Ingenier\u00EDa en inteligenca artificial';

            }
            if( Array.isArray( i.correo.match(RegExPatternAlumno)) === false ){
                i.estado = 0;
                i.error = 'Correo electr\u00F3nico no v\u00E1lido(el correo electr\u00F3nico debe ser institucional de tipo alumno)';
            }
        });
        setCargaAlumnos(arr_alum);
    }


    /*
    * Descripcion:	Convierte cvc a array
    * en carga masiva de profesores
    * Fecha de la creacion:		05/06/2022
    * Author:					Eduardo B
    */
    const processCSVProfesores = (str, delim=',') => {
        
        const rows = str.slice(str.indexOf('\n')+1).split('\n');
        let RegExPatternProfesor = /^[\w-\.]{3,}@ipn\.mx$/;

        let arr_prof = []
        let arrAcademias = [1, 2, 3, 4, 5, 6, 7, 8]
        rows.map( row => {
            if(row !== ''){
                const values = row.split(',');
                arr_prof.push({'no_empleado':values[0].trim(), 'correo':values[1].trim(), 'academia':parseInt(values[2].trim()), 'estado':1, 'error':''})
            }
        })        
        arr_prof.forEach(function(i){ 
            if( alBols.includes(i.no_empleado) || alEmails.includes(i.correo) ){
                i.estado = 0;
                i.error = 'Usuario registrado previamente';
            }
            if( arrAcademias.includes(i.academia) === false ){
                i.estado = 0;
                i.error = 'Los programas academicos son los siguientes: 1-ISC, 2-Ingenier\u00EDa en ciencia de datos, 3-Ingenier\u00EDa en inteligenca artificial';
            }
            if( Array.isArray( i.correo.match(RegExPatternProfesor)) === false ){
                i.estado = 0;
                i.error = 'Correo electr\u00F3nico no v\u00E1lido(el correo electr\u00F3nico debe ser institucional de tipo alumno)';
            }
        });
        setCargaProfesores(arr_prof);

    }
    /*
    * Descripcion:	Envia array de cvc a django
    * Fecha de la creacion:		29/05/2022
    * Author:					Eduardo B 
    */
    const cargarDatosAlumnos = async () =>{ 
        
        let posibles = 0;
        if( cargaAlumnos.length === 0){
            auth.swalFire('No se ha cargado archivo con alumnos');
            return;
        }
        cargaAlumnos.forEach(function(i){ 
            if(i.estado===1){posibles += 1}
        });
        if( posibles === 0){
            auth.swalFire('No existen registros por cargar en este archivo');
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
        url: baseURL+'/comunidad/cargarDatosAlumnos/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'alumnos'       : cargaAlumnos,
        }
        })
        .then(response =>{

            //setAlEmails(response.data.al_emails);
            //setAlBols(response.data.al_boletas);
            let aceptados = response.data.aceptados;
            let cadena = "Se han creado "+aceptados.length+" registros de "+posibles+" posibles."
            Swal.fire({
            title: '',
            icon: 'info',
            html : '<strong>'+cadena+'</strong>',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                startModule();
                loadTables();
                handleClose();
            }
            })

            
            
                    
        }).catch(error => {
            if(!error.status)
                auth.onError()
                
        });
        
       

    }

    /*
    * Descripcion:	Envia array de cvc a django
    * Fecha de la creacion:		29/05/2022
    * Author:					Eduardo B 
    */
    const cargarDatosProfesores = async () =>{ 
        
        let posibles = 0;
        if( cargaProfesores.length === 0){
            auth.swalFire('No se ha cargado archivo con alumnos');
            return;
        }
        cargaProfesores.forEach(function(i){
            if(i.estado===1){posibles += 1}
        });
        if( posibles === 0){
            auth.swalFire('No existen registros por cargar en este archivo');
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
        url: baseURL+'/comunidad/cargarDatosProfesores/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            profesores : cargaProfesores
        }
        })
        .then(response =>{

            /*
            setAlEmails(response.data.al_emails);
            setAlBols(response.data.al_boletas);
            */
            let aceptados = response.data.aceptados;
            let cadena = "Se han creado "+aceptados.length+" registros de "+posibles+" posibles."
            Swal.fire({
            title: '',
            icon: 'info',
            html : '<strong>'+cadena+'</strong>',
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                startModule();
                loadTables();
                handleCloseProf();
            }
            })
            

            
            
                    
        }).catch(error => {
            if(!error.status)
                auth.onError()
                
        });
        
       

    }


    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{
        setShow(false);
        setCargaAlumnos([]);
    } 
    const handleShow = () =>{ setShow(true); }
    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleCloseProf = () =>{
        setShowProf(false);
        setCargaProfesores([]);
    } 
    const handleShowProf = () =>{ setShowProf(true); }




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
                            {/*
                            <img    className="image" src={excel}  width = "30" height = "30" alt="User Icon" title= "Carga masiva de alumnos" style = {{marginLeft:5}}
                                    onClick={resetFormAlumn}
                            />
                            <input src={excel} type="file" id="csvFile" accept=".csv" />
                            */}
                            <img    className="image" src={excel}  width = "30" height = "30" alt="User Icon" title= "Carga masiva de alumnos" 
                                    onClick={handleShow}
                            />&nbsp;&nbsp;

                            {editAlum === false &&  
                            <img className="image" src={addUser}  width = "30" height = "30" alt="User Icon" title= "Agregar alumno" onClick={addAlumno} />
                            }
                            {editAlum === true &&
                                <img className="image" src={save}  width = "30" height = "30" alt="User Icon" title= "Guardar cambios" style = {{marginLeft:8}} 
                                    onClick={guardarAlumno}
                                />
                            }
                            <img    className="image" src={goma}  width = "40" height = "40" alt="User Icon" title= "Limpiar campos" style = {{marginLeft:8}}
                                    onClick={resetFormAlumn}
                            />


                        </div>
                    </div>
                    <div className= "row" style = {{marginTop:60}}>
                        <div className= "col-12" >
                            <DataTable
                                columns = {columAlumnos}
                                data = {alumnos}
                                title = "Comunidad alumnos"
                                noDataComponent="No existen registros disponibles"
                                pagination
                                paginationComponentOptions = {paginacionOpcciones}
                                fixedHeaderScrollHeight = "600px"
                            />
                        </div>
                    </div>


                </Tab>
                <Tab eventKey="profesores" title="Profesores">

                <div className = "row" style = {{marginTop:30}}>
                    <div className = "col-12 d-flex justify-content-center">               
                        <img className="image" src={excel}  width = "30" height = "30" alt="User Icon" title= "Carga masiva de profesores" onClick={handleShowProf} />
                    </div>
                </div>

                    <DataTable
                        columns = {columProfesores}
                        data = {profesores}
                        title = "Comunidad profesores"
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                </Tab>
            </Tabs>

            <Modal size = "xl" show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Carga masiva de usuarios de tipo alumno</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <input src={excel} type="file"  accept=".csv" 
                    onChange = {(e) => {

                        const file = e.target.files[0];
                        const reader = new FileReader();

                        reader.onload = function(e) {
                            const text = e.target.result;
                            try {
                                processCSV(text);
                            }catch (error){
                                setCargaAlumnos([]);
                            }

                        }
                        reader.readAsText(file);
                        
                    }} 
                    />
                    <DataTable
                        columns = {columCargaAlumnos}
                        data = {cargaAlumnos}
                        title = ""
                        noDataComponent="No se ha cargado archivo con alumnos a registrar"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                    
                    

                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={engrane} onClick={cargarDatosAlumnos} width = "25" height = "25" alt="User Icon" title= "Cargar datos alumnos" />
                    <img className="image" src={cancel} onClick={handleClose} width = "25" height = "25" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>

            <Modal size = "xl" show={showProf} onHide={handleCloseProf}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Carga masiva de usuarios de tipo profesor</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <input src={excel} type="file"  accept=".csv" 
                    onChange = {(e) => {

                        const file = e.target.files[0];
                        const reader = new FileReader();

                        reader.onload = function(e) {
                            const text = e.target.result;
                            try {
                                processCSVProfesores(text);
                            }catch (error){
                                setCargaProfesores([]);
                            }

                        }
                        reader.readAsText(file);
                        
                    }} 
                    />
                    
                    <DataTable
                        columns = {columnCargaProfesores}
                        data = {cargaProfesores}
                        title = ""
                        noDataComponent="No se ha cargado archivo con alumnos a registrar"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                    
                    
                    

                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={engrane} onClick={cargarDatosProfesores} width = "25" height = "25" alt="User Icon" title= "Cargar datos profesores" />
                    <img className="image" src={cancel} onClick={handleCloseProf} width = "25" height = "25" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>


        </div>
    )
}