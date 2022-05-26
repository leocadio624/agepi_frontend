import React, {useState, useEffect, useRef} from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";
import aprobado from '../assetss/images/aprobado.png';



const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function AboutPage(){

    const auth = useAuth();
    const step1 = useRef();
    const [estadoProtocol, setEstadoProtocol] = useState(0);
    const [integrantes, setIntegrantes] = useState([{name: '',last_name: ''}]);
    const [firmantes, setFirmantes] = useState([]);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [protocol, setProtocol] = useState({id:0, number:'', fk_team:0, fk_protocol_state:0, creacion:''});
    const [asignacion, setAsignacion] = useState('');
    const [evaluacion, setEvaluacion] = useState('');
    

    
    useEffect(() => {
        startModule();
        
    },[]);
    /*
    * Descripcion: Inicializa datos de linea
    * Fecha de la creacion:		17/05/2022
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
        url: baseURL+'/protocolos/LineProtocolStart/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },params:{
            pk_user : user.id
        }
        })
        .then(response =>{            

            
            if( response.data.length === 0)
                return;
            
            let protocolo = response.data[0]
            let estado = protocolo.fk_protocol_state;
            if(estado === 6 || estado === 7){estado = estado -1}
            setProtocol(protocolo);
            setEstadoProtocol(estado);
            
            for(let i=1; i<=estado; i++){
                document.getElementById('step_'+i.toString()).classList.add("btn-indigo");
            }
            
            

            
            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
        


    }

    /*
    * Descripcion: Inicializa datos de linea
    * Fecha de la creacion:		17/05/2022
    * Author:					Eduardo B 
    */
    const getIntegrantes = async (fk_team) =>{ 
                
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
        url: baseURL+'/protocolos/getIntegrantes/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },params:{
            fk_team : fk_team
        }
        })
        .then(response =>{            

            let integrantes = [];
            response.data.forEach(function(i){ integrantes.push({ 'name':i.name, 'last_name':i.last_name}) });
            setIntegrantes(integrantes);

            
            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
        


    }

    /*
    * Descripcion: Obtiene las firmas de un protocolo
    * Fecha de la creacion:		17/05/2022
    * Author:					Eduardo B 
    */
    const getFirmas = async (fk_protocol) =>{ 

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
        url: baseURL+'/protocolos/getFirmas/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },params:{
            fk_protocol : fk_protocol
        }
        })
        .then(response =>{            

            setFirmantes(response.data);
            let integrantes = [];
            response.data.forEach(function(i){ integrantes.push({ 'name':i.name, 'last_name':i.last_name}) });
            setIntegrantes(integrantes);
            

            
            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
        
        


    }
    /*
    * Descripcion: Obtiene las firmas de un protocolo
    * Fecha de la creacion:		17/05/2022
    * Author:					Eduardo B 
    */
    const getFechaAceptacion = async (fk_protocol) =>{ 

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
        url: baseURL+'/protocolos/getFechaAsignacion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
            fk_protocol : fk_protocol
        }
        })
        .then(response =>{            
            setAsignacion(response.data.fecha_asignacion);

            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
    
    }
    /*
    * Descripcion: Obtiene los profesores que han seleccionado
    * el protocolo en la linea de tiempo
    * Fecha de la creacion:		23/05/2022
    * Author:					Eduardo B 
    */
    const getFechaSeleccion = async (fk_protocol) =>{ 
    
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
        url: baseURL+'/protocolos/getProfesoresSeleccion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
            fk_protocol : fk_protocol
        }
        })
        .then(response =>{            
            setEvaluaciones(response.data);
        
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
        
    
    }
    /*
    * Descripcion: Obtiene los profesores que han seleccionado
    * el protocolo en la linea de tiempo
    * Fecha de la creacion:		23/05/2022
    * Author:					Eduardo B 
    */
    const getFechaEvaluacion = async (fk_protocol) =>{ 
        
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
        url: baseURL+'/protocolos/getFechaEvaluacion/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
            fk_protocol : fk_protocol
        }
        })
        .then(response =>{            
            //console.log(response.data.fecha_evaluacion);
            setEvaluacion(response.data.fecha_evaluacion)
            

            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });
        
        
    
    }

    /*
    * Descripcion: Obtiene los profesores que han seleccionado
    * el protocolo en la linea de tiempo
    * Fecha de la creacion:		23/05/2022
    * Author:					Eduardo B 
    */
    const verEvaluacion = async (fk_seleccion, fk_protocol, fk_user) =>{ 


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
        url: baseURL+'/protocolos/verEvaluacionSinodal/',
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data:{
            fk_seleccion : fk_seleccion,
            fk_protocol : fk_protocol,
            fk_user : fk_user
        }
        })
        .then(response =>{            
            
            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
            window.open(fileURL, "_blank", strWindowFeatures);
            /*
            */

            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });



    }

    

    

    


    const getEstadoProtocolo = async (event, estado) => {
        event.preventDefault();
        
        setEstadoProtocol(estado);
        //console.log(estado)

        if(estado <= protocol.fk_protocol_state){
            if(estado === 2)
                getIntegrantes(protocol.fk_team);
            else if(estado === 3)
                getFirmas(protocol.id);
            else if(estado === 4)
                getFechaAceptacion(protocol.id);
            else if(estado === 5)
                getFechaSeleccion(protocol.id);
            else if(estado === 6)
                getFechaEvaluacion(protocol.id);

            
        }

        

        
    
        



    }


    return(
        
        <div className = "container panel shadow linea" style={{backgroundColor: "white"}} >
            
            
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Estado protocolo</div>
                </div>
            </div>

            <div className="steps-form" style = {{marginTop:50}}>
                <div className="steps-row setup-panel">
                    
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 1);}} id = "step_1" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">1</a>
                        <div className = "label-form" >Registrado</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 2);}} id = "step_2" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">2</a>
                        <div className = "label-form" >Solicitud firmas</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 3);}} id = "step_3" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">3</a>
                        <div className = "label-form" >Firmado</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 4);}} id = "step_4" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">4</a>
                        <div className = "label-form" >Aceptado</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 5);}} id = "step_5" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">5</a>
                        <div className = "label-form" >Seleccionado</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 6);}} id = "step_6" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">6</a>
                        <div className = "label-form" >Evaluado</div>
                    </div>
                    <div className="steps-step">
                        <a href="#" onClick={(e) => { getEstadoProtocolo(e, 7);}} id = "step_7" type="button" className="btn btn-default btn-circle shadow" disabled="disabled">7</a>
                        <div className = "label-form" >Finalizado</div>
                    </div>


                </div>

                </div>
                <form role="form" action="" method="post" style = {{marginTop:50, marginBottom:20}}>
                    {estadoProtocol === 1 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>1.- Registro</h5>
                                <div className = "row row-form">
                                    <div className = "col-lg-6 col-md-6 col-sm-12 d-flex justify-content-start">
                                    <label className = ""  style = {{fontSize:13}} >Fecha de registro&nbsp;&nbsp;&nbsp;&nbsp;{protocol.creacion}</label>
                                    </div>
                                </div>
                            
                            </div>
                        </div>
                    }
                    {estadoProtocol === 2 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>2.- Usuarios con solicitud de firma</h5>
                                {integrantes.map((i, index) =>(
                                    <div className = "row row-form" key = {index}>
                                        <div className = "col-lg-4 col-md-4 col-sm-12 d-flex justify-content-start">
                                            <label className = "" style = {{fontSize:13}} >{i.name} {i.last_name}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    
                    }
                    {estadoProtocol === 3 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>3.- Usuarios que ya han firmado el protocolo</h5>
                                {firmantes.map((i, index) =>(
                                    <div className = "row row-form" key = {index}>
                                        <div className = "col-lg-2 col-md-2 col-sm-12 d-flex justify-content-start">
                                            <label className = "" style = {{fontSize:13}} >{i.name} {i.last_name}</label>
                                        </div>
                                        <div className = "col-lg-4 col-md-4 col-sm-12">
                                            <label className = "" style = {{fontSize:13}} >{i.created}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    {estadoProtocol === 4 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>4.- Aceptado por departamento</h5>
                                <div className = "row row-form">
                                    <div className = "col-lg-6 col-md-6 col-sm-12 d-flex justify-content-start">
                                    <label className = ""  style = {{fontSize:13}} >Fecha en la que se acept&oacute; el protocolo&nbsp;&nbsp;&nbsp;&nbsp;{asignacion}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {estadoProtocol === 5 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>5.- Seleccionado</h5>

                                <table className="table table-bordered">
                                <thead>
                                    <tr style = {{fontSize:12}} >
                                    <th scope="col">Sinodales</th>
                                    <th scope="col">Fecha selecci&oacute;n</th>
                                    <th scope="col" className = "text-center">Evaluado</th>
                                    <th scope="col">Fecha evaluaci&oacute;n</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluaciones.map((i, index) =>(
                                        <tr key = {index} style = {{fontSize:12}}>
                                            <td>{i.name}</td>
                                            <td>{i.created_date}</td>
                                            {i.evaluado === 1 &&
                                            <td align = "center" >
                                                <img  className = "image" src = {aprobado} width = "20" height = "20" alt="User Icon" title= "Ver evaluaci&oacute;n" 
                                                onClick = {() => verEvaluacion(i.id, i.fk_protocol, i.fk_user)}
                                                />
                                            </td>
                                            }
                                            {i.evaluado === 0 &&
                                            <td>
                                                
                                            </td>
                                            }
                                            <td>{i.fecha_evaluacion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>


                            </div>
                        </div>
                    }
                    {estadoProtocol === 6 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                                <h5>6.- Evaluado</h5>
                                <div className = "row row-form">
                                    <div className = "col-lg-6 col-md-6 col-sm-12 d-flex justify-content-start">
                                    <label className = ""  style = {{fontSize:13}} >Fecha en la que se finaliz&oacute; la evaluaci&oacute;n:&nbsp;&nbsp;&nbsp;&nbsp;{evaluacion}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {estadoProtocol === 7 &&
                        <div className="row setup-content">
                            <div className="col-md-12">
                            <h3 className="font-weight-bold pl-0 my-4"><strong>Paso 7</strong></h3>
                            </div>
                        </div>
                    }



                </form>
            
        </div>
        
        
        
    )
}