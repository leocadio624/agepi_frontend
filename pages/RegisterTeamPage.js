import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';



import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";


import add from '../assetss/images/plus.png';
import save from '../assetss/images/save-file.png';
import check from '../assetss/images/comprobado.png';
import cancel from '../assetss/images/cancelar.png';
import delete_icon from '../assetss/images/delete.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterTeam(){

    const auth = useAuth();

    const [datos, setDatos] = useState({name_team:''});

    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);

    const [teams, setTeams] = useState([
        {'id':1, 'name':'Equipo dinamico', 'fecha_creacion':'13/04/2022', 'integrantes':'3'}
    ]);

    useEffect(() => {

        updTableTeam()
        
        
    },[]);

    /*
    * Descripcion:	Actualiza el estado de el equipo registrado
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const updTableTeam = async () => {

        //console.log('actualiza la tabla equipo')
        //return;

        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        

        var pk_user = 1;
        axios({
            method: 'get',
            url: baseURL+'/teams/team_list/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            params: {
                'pk_user': pk_user
            }
        })
        .then(response =>{
            /*
            setKeyList(response.data)
            setShow(true);
            */

        }).catch(error => {
            /*
            if(!error.status)
                auth.onError();
            */
                        
        });

            
    }

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        console.log(datos);
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
        /*
        {
            name:'ID',
            selector:row => row.id,
            sortable:true
        },
        */
        {
            name:'Nombre',
            selector:row => row.name,
            sortable:true,
            center:true
        },
        {
            name:'Fecha creaci\u00F3n',
            selector:row => row.fecha_creacion,
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
                            <img  className = "image" src = {delete_icon} width = "30" height = "30" alt="User Icon" title= "Eliminar equipo" 
                                onClick = {() => deleteTeamHandler(row.id)}/>
                            {/*
                            <img  className = "image" src = {folder} width = "30" height = "30" alt="User Icon" title= "Ver protocolo" 
                                onClick = {() => watchProtocolHandler(row.fileProtocol)} id={row.id} />
                            */}
                            
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
        setEdit(false);
        
    } 
    const handleShow = () =>{ 
        setShow(true);
        setEdit(false);
    } 

    /*
    * Descripcion:	Borra el equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const deleteTeamHandler = (id) =>{
        console.log(id);


    }
    /*
    * Descripcion:	Crea el equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const handleSave = async () =>{
        
        //auth.onErrorMessage('prueba de error');
        
        //setEdit(!edit);

        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
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
                'fk_user'   : 1,
                'nombre'    : 'pruebas creacion de equipo'
            }
            
        })
        .then(response =>{

            /*
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
            */


            
        }).catch(error => {
            
            /*
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            */
            
            
            
        });
        



    }
    /*
    * Descripcion:	Borra el equipo
    * Fecha de la creacion:		13/04/2022
    * Author:					Eduardo B 
    */
    const handleCheck = () =>{

        setEdit(!edit);
        


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
        





        
                {/*
                <Button className="nextButton" onClick={handleShow}>
                    Open Modal
                </Button>
                */}


                <Modal size="lg" show={show} onHide={handleClose}>
                    <Modal.Header closeButton  className = "bg-primary" >
                        <Modal.Title >
                            <div className = "title" >Registro equipo</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <div className= "row row-form" >
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Nombre</div>
                        </div>
                        <div className = "col-lg-4 col-md-4 col-sm-6"> 
                            {/*
                            <input className = "form-control" type="text" name = "title" placeholder = "Titulo de protocolo" onChange = {handleInputChange} />
                            */}
                            <input type = "text" className = "form-control" name = "name_team" placeholder = "Nombre de equipo" onChange = {handleInputChange}  autoFocus/>

                        </div>

                    </div>
                    <div className= "row row-form" >
                        <div className = "col-lg-12">

                            <DataTable
                            columns = {columnas}
                            //data = {protocols}
                            data = {teams}
                            title = "Equipo"
                            pagination
                            paginationComponentOptions = {paginacionOpcciones}
                            fixedHeaderScrollHeight = "600px"
                            />
                        </div>

                    </div>
                        {/*
                        <div className = "table-responsive" style={{marginTop:20, marginBottom:20}}>
                        </div>
                        */}

                


                                
                                

                        

                        {/* 
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col" style = {{textAlign:"center"}} >Palabra clave</th>
                                    <th scope="col" style = {{textAlign:"center"}} >Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keyList.map((i, index) =>(
                                    <tr scope = "row" key = {index}>
                                        <td  style = {{textAlign:"center"}}>
                                            {i.word}
                                        </td>
                                        <td style = {{textAlign:"center"}}>
                                            <img className="image" src={delete_icon} onClick = {() => deleteWord(i.id)} width = "30" height = "30" alt="User Icon" title= "Eliminar palabra clave" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    
                    import save from '../assetss/images/save-file.png';
                    import check from '../assetss/images/comprobado.png';

                        */}
                    


                    </Modal.Body>
                    <Modal.Footer className = "panel-footer">
                        
                        <button onClick ={handleSave} >Crear</button>
                        <button onClick ={updTableTeam} >updTableTeam</button>
                        {edit === true &&
                            <img className="image" src={save} onClick={handleSave} width = "30" height = "30" alt="User Icon" title= "Guardar" />
                        }
                        {edit === false &&
                            <img className="image" src={check} onClick={handleCheck} width = "30" height = "30" alt="User Icon" title= "Crear equipo" />
                        }
                        <img className="image" src={cancel} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" /> 
                    </Modal.Footer>
                </Modal>
        
        </div>

    )
}