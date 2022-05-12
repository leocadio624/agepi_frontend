import {useParams} from 'react-router-dom';
import React, {useState, useEffect, useRef} from 'react';


import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";
import Swal from 'sweetalert2';

const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function ValidarQR2(){
    const params = useParams();
    const auth = useAuth();

    useEffect(() => {
        startModule();
        
    },[]);
    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
   const startModule = async () =>{
       
       //console.log('star module');
       //console.log(params.param);

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
        url: baseURL+'/protocolos/firmasQR/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
            pk_protocol:params.param
        }
        })
        .then(response =>{
            /*    
            console.log(response.data);
            setSolicitudes(response.data);
            */
            
        }).catch(error => {
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
        });
        
        

    }
    return(
        <div>
        </div>
    )
}