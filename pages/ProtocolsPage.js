import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';


import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';






import axios from 'axios';
import ver from '../assetss/images/ver.png';
import save from '../assetss/images/save-file.png';
import cancel from '../assetss/images/cancelar.png';
const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ProtocolsPage(){

    const [show, setShow] = useState(false);
    const [protocols, setProtocols] = useState([]);
    const [keyList, setKeyList] = useState([
        {id:1, word:'a'},
        {id:2, word:'b'},
        {id:3, word:'c'}

    ]);
    
    

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
            cell:(row) => <img  className = "image" src = {ver} width = "30" height = "30" alt="User Icon" title= "Ver detalle" 
                                onClick = {() => clickHandler(row.id)} id={row.id} />,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

        



    ];
    useEffect(() => {
        
        axios.get(
            baseURL+'/protocolos/protocolos/'
        )
        .then(response => {
            setProtocols(response.data);
        }).catch(error => {
            setProtocols([]);
        })
        
        

    }, []);

    const updTable = () => {

        
        axios.get(
            baseURL+'/protocolos/protocolos/'
        )
        .then(response => {
            setProtocols(response.data);
        }).catch(error => {
            setProtocols([]);
        })
        
    }

    const descarga = () =>{
        
        const config = { responseType: 'blob' };
        
        axios.get(baseURL+'/downloadFile/',
        config).
        then(response => {

            
            //console.log(response);

            
            /*
            let url = window.URL.createObjectURL(response.data);
            let a = document.createElement("a");
            a.href = url;
            a.download = 'descarga.pdf';
            a.click();
            */



            

            
            
            
            /*
            console.log(response)
            console.log(response.data)
            */


            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            //window.open(fileURL, '_blank');

            //window.open(fileURL, "width=200,height=100");

            /*
            var anchor = document.createElement('a');
            anchor.download = "descarga.pdf";
            anchor.href = (window.webkitURL || window.URL).createObjectURL(response.data);
            anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
            anchor.click();
            */

            

        });


    }
    const clickHandler = (id) => {

        console.log(id);
        
    }

    const handleClose = () =>{
        setShow(false);
        //console.log('cerrar')

    } 
    const handleShow = () =>{
        setShow(true);

        /*
        axios.get(
            baseURL+'/protocolos/palabras_clave/'
        )
        .then(response => {
            console.log(response.data);
            
        }).catch(error => {
            
        })
        */


        
    } 

    const paginacionOpcciones = {
        rowsPerPageText         : 'Filas por pagina',
        rangeSeparatorText      : 'de',
        selectAllRowsItem       : true,
        selectAllRowsItemText   : 'Todos'
    }

    return(
        

        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Protocolos registrados</div>
                </div>
            </div>
            
            

                
            

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
                    <button onClick ={descarga} >Descarga</button>
                </div>
            </div>
            
            
        
            
            

            <Button className="nextButton" onClick={handleShow}>
                Open Modal
            </Button>

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
                                        {i.word}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* 
                    */}
                
                </Modal.Body>
                <Modal.Footer className = "panel-footer">
                    <img className="image" src={cancel} width = "30" height = "30" alt="User Icon" title= "Cerrar" />
                </Modal.Footer>
            </Modal>

          


        </div>







    )
            
}