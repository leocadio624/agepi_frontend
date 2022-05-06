//import { useParams } from 'react-router-dom'
import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";

import pdf from '../assetss/images/pdf.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function SigningRequestPage(){
    
    //const { username } = useParams()
    const auth = useAuth();
    const [solicitudes, setSolicitudes] = useState([]);

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
            if(response.status === 401){ auth.sesionExpirada(); return;}
        }catch(error){
            if(!error.status)
                auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        /*
        "fk_user_destino": 17,
        */
       
       axios({
        method: 'get',
        url: baseURL+'/protocolos/solicitudes_firma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        
        })
        .then(response =>{

            console.log(response.data);
            setSolicitudes(response.data);
            /*
            setTeams(response.data.teams);
            setSolicitudes(response.data.solicitudes)
            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);
            */

            

        }).catch(error => {
            auth.onError();
            
            
        });

    }

    /*
    * Descripcion:	Visualiza el archivo de protocolo
    * Fecha de la creacion:		03/05/2022
    * Author:					Eduardo B 
    */
    const descargarArchivo = async (path) => {
        
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
        url: baseURL+'/downloadFile/',
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data : {
            'pathProtocol'      : path
        }
        })
        .then(response =>{
            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            window.open(fileURL, "_blank", strWindowFeatures);

        }).catch(error => {
            if(!error.status)
                auth.onError();
                        
        });
        


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
            name:'T\u00EDtulo',
            selector:row => row.titulo,
            sortable:true,
            center:true
        },
        {
            name:'Fecha solicitud',
            selector:row => row.fecha,
            sortable:true,
            center:true
        },
        {
            name:'Numero de firmas',
            selector:row => '',
            sortable:true,
            left:true

        },
        {
            name:'Per\u00EDodo',
            selector:row => row.periodo,
            sortable:true,
            left:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>
                            <img    className = "image" src = {pdf} width = "30" height = "30" alt="User Icon" title= "Ver detalle protocolo" 
                                    onClick = {() => descargarArchivo(row.path_protocol)} style = {{marginRight:7}}/>

                            
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
    ];


    return(
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Solicitudes firma</div>
                </div>
            </div>

            <div className = "row" >
                <div className = "col-12 tb-responsive">

                    
                    <DataTable
                        columns = {columnas}
                        data = {solicitudes}
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