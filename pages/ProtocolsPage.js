import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import ver from '../assetss/images/ver.png';
const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function ProtocolsPage(){

    const [protocols, setProtocols] = useState([]);
    /*
    const datos = [
        {id:1, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:2, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:3, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:4, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:5, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:6, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:7, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:8, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:9, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:10, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:11, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:12, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:13, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:14, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:15, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:16, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:17, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:18, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:19, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:20, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:21, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'},
        {id:22, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:23, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'},
        {id:24, anio:'2001', campeon:'Bercelona', subcampeon:'Valencia'}
        
    ]


    const datos = [
        {id:1, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'}
    ]
    */
    const [datos, setDatos] = useState([{id:1, anio:'2000', campeon:'Real madrid', subcampeon:'Valencia'}]);

    const columnas = [
        /*
        {
            name:'ID',
            selector:row => row.id,
            sortable:true
        },
        */
        {
            name:'anio',
            selector:row => row.anio,
            sortable:true
        },
        {
            name:'campeon',
            selector:row => row.campeon,
            sortable:true
        },
        {
            name:'subcampeon',
            selector:row => row.subcampeon,
            sortable:true,
            right:true

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
        //console.log('ready');    

        axios.get(
            baseURL+'/protocolos/protocolos/'
        )
        .then(response => {
            //console.log(response.data);
            setProtocols(response.data);
        }).catch(error => {
    
        })

        


    });

    const updTable = () => {
        
        console.log(protocols);
        
        

    }
    const clickHandler = (id) => {

        console.log(id);
        
        /*
        setDatos([
            {id:1, anio:'2000', campeon:'Mariana', subcampeon:'Angel'},
            {id:2, anio:'2000', campeon:'Mariana', subcampeon:'Angel'},
            {id:3, anio:'2000', campeon:'Mariana', subcampeon:'Angel'},
            {id:4, anio:'2000', campeon:'Mariana', subcampeon:'Angel'}
    
        ])
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
            {/*
            <div>{JSON.stringify(protocols)}</div>
            */}

                
            {/* 
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Numero</th>
                    <th scope="col">Titulo</th>
                    <th scope="col">Resumen</th>
                    <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {protocols.map((protocol, index) =>(
                        <tr>
                            <th scope="row">{protocol.id}</th>
                            <td>{protocol.number}</td>
                            <td>{protocol.title}</td>
                            <td>{protocol.sumary}</td>
                            <td>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            */}

            <div className = "table-responsive" style={{marginTop:20, marginBottom:20}}>

            <DataTable
            columns = {columnas}
            data = {datos}
            title = "Prueba"
            pagination
            paginationComponentOptions = {paginacionOpcciones}
            fixedHeaderScrollHeight = "600px"
            />
            </div>


            
            

            <div className = "row panel-footer">
                <div className = "col-12 d-flex justify-content-center">
                    <button onClick ={updTable} >Update</button>
                </div>
            </div>
        </div>




    )
            
}