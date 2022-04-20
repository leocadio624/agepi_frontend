import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal} from 'react-bootstrap';
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
const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterTeam(){

    const auth = useAuth();
    const name_team = useRef();

    const [datos, setDatos] = useState({name_team:''});

    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [estado, setEstado] = useState(false);


    const [teams, setTeams] = useState([]);

    useEffect(() => {
        updTableTeam();
        
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
            left:true

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



    /*
    * Descripcion:	Actualiza el estado de el equipo registrado
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const updTableTeam = async () => {

        const   user = JSON.parse(localStorage.getItem('user'));    
        //console.log(user);
        //return;

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
            url: baseURL+'/teams/team_list/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            params: {
                'pk_user': user.id
            }
        })
        .then(response =>{
            setTeams(response.data);
            

        }).catch(error => {

            
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
                        
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
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);


        axios({
            method: 'delete',
            url: baseURL+'/teams/teams/'+encodeURIComponent(id)+'/',
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
                updTableTeam();
            })
            
            

        }).catch(error => {
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

        
        axios({
            method: 'get',
            url: baseURL+'/teams/teams/'+encodeURIComponent(id)+'/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
            
        })
        .then(response =>{
            
            setDatos({name_team:response.data.nombre});
            setEdit(true);


        }).catch(error => {
            
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
    return(
        
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Protocolos registrados</div>
                </div>
            </div>

            <div className = "row">
                
                <div className = "col-12 d-flex justify-content-start">
                    <img className="image" src={add}  onClick={handleShow} width = "40" height = "40" alt="User Icon" title= "Crear equipo" style = {{marginLeft:35}}/>
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
        
        </div>

    )
}