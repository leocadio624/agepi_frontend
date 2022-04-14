import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';



import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";


import ver from '../assetss/images/ver.png';
import save from '../assetss/images/save-file.png';
import folder from '../assetss/images/folder.png';
import cancel from '../assetss/images/cancelar.png';
import delete_icon from '../assetss/images/delete.png';


const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ProtocolsPage(){

    const auth = useAuth();
    const [show, setShow] = useState(false);
    const [protocols, setProtocols] = useState([]);
    const [keyList, setKeyList] = useState([]);
    
    
    /*
    * Descripcion:	Cambia idioma del data table
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const paginacionOpcciones = {
        rowsPerPageText         : 'Filas por pagina',
        rangeSeparatorText      : 'de',
        selectAllRowsItem       : true,
        selectAllRowsItemText   : 'Todos'
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
            name:'Numero',
            selector:row => row.number,
            sortable:true,
            center:true
        },
        {
            name:'Titulo',
            selector:row => row.title,
            sortable:true,
            center:true
        },
        {
            name:'Resumen',
            selector:row => row.sumary,
            sortable:true,
            left:true

        },
        {   
            name:'Acciones',
            cell:(row) =>  <>
                            <img  className = "image" src = {ver} width = "30" height = "30" alt="User Icon" title= "Ver detalle" 
                                onClick = {() => watchWordsHandler(row.id)}  style = {{marginRight:7}}/>
                            <img  className = "image" src = {folder} width = "30" height = "30" alt="User Icon" title= "Ver protocolo" 
                                onClick = {() => watchProtocolHandler(row.fileProtocol)} id={row.id} />
                            </> 
                            ,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

  

    
    useEffect(() => {

        updTable()
        
        
    },[]);


    /*
    * Descripcion:	Muestra lista de protocolos
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const updTable = async () => {

        
        
        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        
        
        axios({
            method: 'get',
            url: baseURL+'/protocolos/protocolos/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(response =>{
            setProtocols(response.data);
            
        }).catch(error => {
            setProtocols([]);
            if(!error.status)
                auth.onError()
            
        });
            
    }

    /*
    * Descripcion:	Eliminacion de palabra clave.
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const deleteWord = async (id) =>{

    
    
        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);

        axios({
            method: 'delete',
            url: baseURL+'/protocolos/palabras_clave/'+encodeURIComponent(id)+'/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
            
        })
        .then(response =>{
            Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registro eliminado',
            showConfirmButton: false,
            timer: 1500
            }).then(function() {
                watchWordsHandler(response.data.fk_protocol);
            })
            

        }).catch(error => {
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
                        
        });

        



    }

    /*
    * Descripcion:	Muestra lista de palabras clave por protocolo
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const watchWordsHandler = async (id) => {
        

        const  user = JSON.parse(localStorage.getItem('user'));    
        const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        const body = await response.json();
        const token = body.access || '';
        auth.refreshToken(token);


        axios({
            method: 'get',
            url: baseURL+'/protocolos/palabras_clave_list/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            params: {
                'key': id
            }
        })
        .then(response =>{
            setKeyList(response.data)
            setShow(true);

        }).catch(error => {
            if(!error.status)
                auth.onError();
                        
        });
        
                
    }
    /*
    * Descripcion:	Descarga de protocolo en ventana emergente.
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const watchProtocolHandler = async (pathProtocol) =>{

        


        if(pathProtocol === ''){
            auth.onError();

        }else{

            const  user = JSON.parse(localStorage.getItem('user'));    
            const response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
            const body = await response.json();
            const token = body.access || '';
            auth.refreshToken(token);


            axios({
                method: 'post',
                url: baseURL+'/downloadFile/',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${ token }`
                },
                data : {
                    'pathProtocol'      : pathProtocol
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
        
        
        
        


    }

    /*
    * Descripcion:	Despliegue y cierre de centana modal
    * Fecha de la creacion:		08/04/2022
    * Author:					Eduardo B 
    */
    const handleClose = () =>{ setShow(false); } 
    const handleShow = () =>{ setShow(true); } 


    return(
        

        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Protocolos registrados</div>
                </div>
            </div>
            
            {/*
            <div>{JSON.stringify(protocols)}</div>
            */}
                
            

            <div className = "table-responsive" style={{marginTop:20, marginBottom:20}}>

                <DataTable
                columns = {columnas}
                data = {protocols}
                title = ""
                pagination
                paginationComponentOptions = {paginacionOpcciones}
                fixedHeaderScrollHeight = "600px"
                />
                
            </div>

            <div className = "row panel-footer">
                <div className = "col-12 d-flex justify-content-center">

                    
                    <button onClick ={updTable} >Update</button>
                    {/*
                    <button onClick ={sendGetRequest} >sendGetRequest</button>
                        <button onClick ={deleteWord} >deleteWord</button>
                    */}
                    
                    
                </div>
            </div>
            
            
        
            
            
            {/*
            <Button className="nextButton" onClick={handleShow}>
                Open Modal
            </Button>
            */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton  className = "bg-primary" >
                <Modal.Title >
                    <div className = "title" >Palaras clave</div>
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    {/* 
                    */}
                
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={cancel} onClick={handleClose} width = "30" height = "30" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>

          


        </div>







    )
            
}