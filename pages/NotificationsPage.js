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


const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function NotificationsPage(){

    const auth = useAuth();

    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        startModule();
        
    },[]);

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
            
            console.log(response.data)
            /*
            setTeams(response.data.teams);
            setSolicitudes(response.data.solicitudes)
            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);
            */
            
            
            
        }).catch(error => {
            auth.onError();
            
            
        });
        /*
        */

    }

    

    return(

        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Notificaciones</div>
                </div>
            </div>

            <div className = "row panel-footer">
                <div className = "col-12 d-flex justify-content-center">
                    <button  >Update</button>
                </div>
            </div>

        </div>

    )
}