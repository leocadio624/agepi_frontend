import React, {useState, useEffect, useRef} from 'react';
import DataTable from 'react-data-table-component';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal} from 'react-bootstrap';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TabContainer from 'react-bootstrap/TabContainer';

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


export default function ComunidadPage(){
    const auth = useAuth();
    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);

    useEffect(() => {
        updTableAlumno();
        
    },[]);

    const updTableAlumno = async () =>{ 
        
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
            url: baseURL+'/comunidad/comunidad/',
            headers: {
                'Authorization': `Bearer ${ token }`
            }
        })
        .then(response =>{
            //console.log(response.data.alumnos);

            setAlumnos(response.data.alumnos);
            setProfesores(response.data.profesores);

            //setProtocols(response.data);
            
        }).catch(error => {

            /*
            setProtocols([]);
            if(!error.status)
                auth.onError()
            */
            
        });



        //console.log(user);


    }

    return(
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >

            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Control de acceso</div>
                </div>
            </div>

            
            <Tabs defaultActiveKey="alumnos" id="uncontrolled-tab-example" className="mb-3" style = {{marginTop:30}}>
                <Tab eventKey="alumnos" title="Alumnos">
                    alumnos
                </Tab>
                <Tab eventKey="profesores" title="Profesores">
                    profesores
                </Tab>
            </Tabs>
            <button onClick={updTableAlumno} >alumnos</button>





            
        </div>
    )
}