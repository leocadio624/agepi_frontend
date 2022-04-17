import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal} from 'react-bootstrap';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';

import Swal from 'sweetalert2';

import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";


import add from '../assetss/images/plus.png';
import goma from '../assetss/images/iconoBorrar.png';
import save from '../assetss/images/save-file.png';
import check from '../assetss/images/comprobado.png';
import cancel from '../assetss/images/cancelar.png';
import delete_icon from '../assetss/images/delete.png';
import edit_icon from '../assetss/images/lapiz.png';
const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ComunidadPage(){
    const auth = useAuth();
    const [programas, setProgramas] = useState([]);

    
    const [alumno, setAlumno] = useState({'id':0, 'boleta':'', 'email_al':'', 'programa':-1});
    //const [programa, setPrograma] = useState(-1);
    

    
    const [alumnos, setAlumnos] = useState([]);


    const [profesores, setProfesores] = useState([]);

    useEffect(() => {
        programasAcademicos();
        updTableAlumno();
        
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
                                onClick = {() => setAlumno({'id':row.id, 'boleta':row.boleta, 'email_al':row.email, 'programa':row.fk_programaAcademico})   } id={row.id} />
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar alumno" 
                                onClick = {() => deleteTeamHandler(row.id)}/>

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
                            <img  className = "image" src = {edit_icon} width = "30" height = "30" alt="User Icon" title= "Editar equipo" 
                                onClick = {() => editTeamHandler(row.id )} id={row.id} />
                            
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar equipo" 
                                onClick = {() => deleteTeamHandler(row.id)}/>


                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

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
            //console.log('programas academicos');
            //console.log(response.data);
            setProgramas(response.data);
            
            
        }).catch(error => {

            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
        });

    }




    const updTableAlumno = async () =>{ 
        
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

            //console.log(response.data);
            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);

            //setProtocols(response.data);
            
        }).catch(error => {

            if(!error.status){
               auth.onError()
               setAlumnos([]);
               setProfesores([]);
            }
            auth.onErrorMessage(error.response.data.message);
            
        });

    }
    

    const editTeamHandler = async (id) =>{ 
        console.log(id);
        

    }

    const deleteTeamHandler = async (id) =>{ 
    }

    const shoot = () => {
        console.log(alumno)
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


                    <div className= "row" style = {{marginTop:30}} >
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Boleta</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6"> 
                            <input className = "form-control" type="text" name = "boleta" value = {alumno.boleta} placeholder = "N&uacute;mero de boleta" onChange = {handleInputChange} />
                        </div>
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Correo electr&oacute;nico</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6">
                            <input className = "form-control" type="text" name = "email_al" value = {alumno.email_al} placeholder = "Correo electr&oacute;nico institucional" onChange = {handleInputChange} />
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
                            
                            <select className = "form-select" name = "programa"  onChange = {handleInputChange} value = {alumno.programa}>
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
                            <button onClick={() => shoot()} >alumnos</button>
                             */}
                            <img className="image" src={add}  width = "30" height = "30" alt="User Icon" title= "Cerrar"  />
                            <img className="image" src={save}  width = "30" height = "30" alt="User Icon" title= "Crear registro" style = {{marginLeft:5}} />
                            <img className="image" src={goma}  width = "40" height = "40" alt="User Icon" title= "Limpiar campos" style = {{marginLeft:5}} />
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