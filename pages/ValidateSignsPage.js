import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";
import Swal from 'sweetalert2';
import check from '../assetss/images/comprobado.png';
import clean from '../assetss/images/iconoBorrar.png';


const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function ValidateSignPage(){

    const auth = useAuth();
    const [estado, setEstado] = useState({error:false, message_error:''})    
    const [datos, setDatos] = useState({firma:''})
    const [protocolos, setProtocolos] = useState([{id: '',numero: ''}])
    const [protocolo, setProtocolo] = useState('-1');
    const [integrante, setIntegrante] = useState('-1')
    const [integrantes, setIntegrantes] = useState([{pk_user: '',nombre:''}])
    
    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        setEstado({error:false, message_error:''});
    }

    const protocol_ref = useRef();
    const member_ref = useRef();
    const firma_ref = useRef();


    useEffect(() => {
        startModule();
    },[]);

    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		11/05/2022
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
        url: baseURL+'/firma/verificaFirmaStart/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'pk_user': user.id
        }
        })
        .then(response =>{

            let aux_protocol = [];
            response.data.forEach(i =>{
                aux_protocol.push({'id':i.id, 'numero':i.number});
            });
            setProtocolos(aux_protocol)
            
        }).catch(error =>{
            auth.onError();    
        });

    }
    /*
    * Descripcion: Actualiza el catalogo de integrantes de protocolo
    * Fecha de la creacion:		14/05/2022
    * Author:					Eduardo B 
    */
    const getIntegrantes = async (pk_protocol) =>{

        pk_protocol = parseInt(pk_protocol);        
        if(pk_protocol === -1){setIntegrantes([]); return;} 

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
        url: baseURL+'/firma/getIntegrantesProtocolo/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            pk_protocol : pk_protocol
        }
        })
        .then(response =>{
            
            let aux_integrantes = [];
            response.data.forEach(i =>{
                aux_integrantes.push({'pk_user':i.fk_user, 'nombre':i.name+' '+i.last_name});
            });
            setIntegrantes(aux_integrantes);
            
            
        }).catch(error =>{
            auth.onError();    
            setIntegrantes([]);
        });

    }
    const limpiarCampos = () =>{
        setDatos({firma:''});
        setEstado({error:false, message_error:''});
        setProtocolo('-1');
        setIntegrante('-1');
        setIntegrantes([]);



    }
    /*
    * Descripcion: Verifica documento con llave publica
    * y cadena proporcionada
    * Fecha de la creacion:		14/05/2022
    * Author:					Eduardo B 
    */
    const verificaFirma = async () =>{

        let protocol = parseInt(protocolo);
        let member = parseInt(integrante);
        
        if( protocol === -1){
            setEstado({error:true, message_error:'Seleccione un protocolo'});
            protocol_ref.current.focus();
            return;
        }
        if( member === -1){
            setEstado({error:true, message_error:'Seleccione un integrante de protocolo'});
            member_ref.current.focus();
            return;
        }
        if(datos.firma.trim() === ''){
            setEstado({error:true, message_error:'Ingrese la firma de protocolo que desea validar'});
            firma_ref.current.focus();
            return;
        }
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
        url: baseURL+'/firma/verificaFirma/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            'pk_protocol' : protocol,
            'pk_user': member,
            'firma': datos.firma.trim()
        }
        })
        .then(response =>{

            Swal.fire({
            title: '',
            icon: 'success',
            html: "<div><strong>"+response.data.message+"</strong></div>",
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                limpiarCampos();
            }
            })
                
        }).catch(error => {
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
        });
        
    }
    return(
        <div className = "container panel shadow" style={{backgroundColor: "white"}} >
            
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Varificador de firmas</div>
                </div>
            </div>
            {estado.error === true  &&
                <div className = "row" style = {{marginTop:30}} >
                    <div className = "col-12">
                        <div className = "alert alert-danger" role="alert" >
                            {estado.message_error}
                        </div>
                    </div>
                </div>
            }
            <div className = "row row-form">
                <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                    <div className = "label-form" >Protocolo</div>
                </div>
                <div className = "col-lg-4 col-md-4 col-sm-6">
                    <select className = "form-select" 
                        value = {protocolo}
                        ref = {protocol_ref}
                        onChange = {(e) =>{
                            setProtocolo(e.target.value);
                            getIntegrantes(e.target.value);

                            if( parseInt(e.target.value) !== -1)
                                setEstado({error:false, message_error:''});
                            
                        }}
                    >
                        <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                        {protocolos.map((obj, index) =>(
                            <option key = {index} value = {obj.id} >{obj.numero}</option>
                        ))}
                    </select>
                </div>

                <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                    <div className = "label-form" >Integrantes</div>
                </div>
                <div className = "col-lg-4 col-md-4 col-sm-6">
                    <select className = "form-select" 
                        value = {integrante}
                        ref = {member_ref}
                        onChange = {(e) =>{

                            setIntegrante(e.target.value);
                            if( parseInt(e.target.value) !== -1)
                                setEstado({error:false, message_error:''});
                        }}
                    >
                        <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                        {integrantes.map((obj, index) =>(
                            <option key = {index} value = {obj.pk_user} >{obj.nombre}</option>
                        ))}
                    </select>
                </div>
 
            </div>
            <div className = "row row-form">
                <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                    <div className = "label-form" >Firma (sello digital)</div>
                </div>
                <div className = "col-lg-10 col-md-10 col-sm-6">
                    <input type="text" className = "form-control" ref = {firma_ref} name = "firma" value = {datos.firma} onChange = {handleInputChange}  />
                </div>
            </div>

            <div className = "row panel-footer" style = {{marginTop:20}} >
                <div className = "col-12 d-flex justify-content-center">
                    <img className="image" src={check}  onClick = {verificaFirma} width = "30" height = "30" alt="User Icon" title= "Verificar firma" style = {{marginRight:5}}/>
                    <img className="image" src={clean}  onClick = {limpiarCampos} width = "35" height = "35" alt="User Icon" title= "Limpiar campos" />
                </div>
            </div>

        </div>
    )
}