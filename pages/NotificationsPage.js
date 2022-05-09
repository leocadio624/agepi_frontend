import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

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
import question from '../assetss/images/question.png';
import firma from '../assetss/images/firma-digital.png';


const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function NotificationsPage(){

    const auth = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);


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
    const columnasNotificaciones = [
        {
            name:'Usuario',
            selector:row => <div>{row.user_origen}</div>,
            sortable:true,
            center:true
        },
        {
            name:'Tipo',
            selector:row => row.notificacion,
            sortable:true,
            center:true
        },
        {
            name:'Descripccion',
            selector:row => <div title = {''+row.str_salida+''}>{row.str_salida}</div>,
            sortable:true,
            left:true
            

        },
        {
            name:'Fecha',
            selector:row => row.fecha,
            sortable:true,
            center:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  
                <>
                    {   row.fk_tipoNotificacion === 1 && row.state &&
                    <>  
                        <img    className = "image" src = {check} width = "30" height = "30" alt="User Icon" title= "Aceptar solicitud" 
                                style = {{marginRight:5}}
                                onClick = {() => aceptarSolicitud(row.id, row.fk_user_origen, row.fk_user_destino)} id={row.id}
                        />
                        <img  className = "image" src = {cancel} width = "30" height = "30" alt="User Icon" title= "Rechazar solicitud" 
                                onClick = {() => rechazarSolicitud(row.id, row.fk_user_origen, row.fk_user_destino)} id={row.id}
                        />
                    </>
                    }
                    {   row.fk_tipoNotificacion === 4 && row.state &&
                        <a href="/solicitudes_firma" >
                            <img    className = "image" src = {firma} width = "30" height = "30" alt="User Icon" title= "Firmar protocolo" />
                        </a>    
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
        
        
        axios({
            method: 'get',
            url: baseURL+'/notificacion/notificaciones/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            params: {
                'pk_user': user.id
            }
        })
        .then(response =>{
            
            setNotificaciones(response.data.notificaciones);
            
            
        }).catch(error => {
            auth.onError();
            
            
        });
        

    }

    /*
    * Descripcion: Cambia el estado de registro de estado 1 a 2 en tabla
    * miembros de equipo
    * Fecha de la creacion:		26/04/2022
    * Author:					Eduardo B 
    */
    const aceptarSolicitud = async (id_notificacion, fk_user_origen, id_teamMember) =>{
        
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
            url: baseURL+'/notificacion/notificaciones/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            data : {
            id_notificacion : id_notificacion,
            id_user : user.id,
            fk_user_origen : fk_user_origen,
            id_teamMember : id_teamMember
            }
        })
        .then(response =>{
            
            
            if(response.status === 226){
                auth.onErrorMessage("No puedes aceptar esta invitaci\u00F3n, ya estas relacionado en el equipo: \""+response.data.team+"\"");

            }else if(response.status === 200){
                
                Swal.fire({
                icon: 'success',
                html : "Te has unido al siguiente equipo:<strong><br>\""+response.data.team+"\"</strong>",
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




            }
            


            
            
            
            
            
            
        }).catch(error => {
            //auth.onError();
            
            
        });


    }

    /*
    * Descripcion: Rechaza solicitud de integracion de equipo
    * miembros de equipo
    * Fecha de la creacion:		26/04/2022
    * Author:					Eduardo B 
    */
    const rechazarSolicitud = async (id_notificacion, fk_user_origen, id_teamMember) =>{

       
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
            url: baseURL+'/notificacion/cancelarInvitacion/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            data : {
                id_notificacion : id_notificacion,
                id_user : user.id,
                fk_user_origen : fk_user_origen,
                id_teamMember : id_teamMember
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
                startModule();
            })

            
        }).catch(error => {
            
        });
        


    }

    return(

        
        
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Notificaciones</div>
                </div>
            </div>
            <div className = "row" >
                <div className = "col-12 tb-responsive">

            
                    <DataTable
                        columns = {columnasNotificaciones}
                        data = {notificaciones}
                        title = "Notificaciones disponibles"
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                </div>

            </div>

            <div className = "row panel-footer">
                <div className = "col-12 d-flex justify-content-center">
                    
                </div>
            </div>
        </div>

            
        
        
        
    )
}