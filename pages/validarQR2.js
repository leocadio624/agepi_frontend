import {useParams} from 'react-router-dom';
import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';


import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";
import Swal from 'sweetalert2';

import check from '../assetss/images/comprobado.png';
import cancel from '../assetss/images/cancelar.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function ValidarQR2(){
    const params = useParams();
    const auth = useAuth();
    const [firmas, setFirmas] = useState([]);

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
            name:'Firmante',
            selector:row => <div>{row.name} {row.last_name}</div>,
            sortable:true,
            center:true
        },
        {
            name:'T\u00CDtulo protocolo',
            selector:row => <div>{row.title}</div>,
            sortable:true,
            center:true
        },
        {
            name:'Fecha de firma',
            selector:row => <div>{row.fecha_firma}</div>,
            sortable:true,
            left:true
            

        },
        {   
            name:'Estado',
            cell:(row) =>  
                <>
                    {   row.is_valid === 1 &&
                        <img    className = "image" src = {check} width = "30" height = "30" alt="User Icon" title= "Firma v&aacute;lidada" 
                                style = {{marginRight:5}}
                                
                        />
                    }
                    {   row.is_valid === 0 &&
                        <img    className = "image" src = {cancel} width = "30" height = "30" alt="User Icon" title= "Firma no v&aacute;lida" 
                        style = {{marginRight:5}}
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
            setFirmas(response.data);

        }).catch(error => {
            setFirmas([]);
            if(!error.status)
                auth.onError();
            auth.onErrorMessage(error.response.data.message);
        });
        
        

    }
    return(

        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Validaci&oacute;n de firmas</div>
                </div>
            </div>
            <div className = "row" >
                <div className = "col-12 tb-responsive">
                    <DataTable
                        columns = {columnasNotificaciones}
                        data = {firmas}
                        title = ""
                        noDataComponent="No existen registros disponibles"
                        pagination
                        paginationComponentOptions = {paginacionOpcciones}
                        fixedHeaderScrollHeight = "600px"
                    />
                </div>
            </div>
        </div>

    )
}