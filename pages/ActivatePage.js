import React, {useState, useRef} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import '../assetss/css/login.css';
import logo from '../assetss/images/logo.png';
import email from '../assetss/images/email.png';



import { fetchWithToken } from "../helpers/fetch";
import axios from 'axios';
import Swal from 'sweetalert2';
const baseURL = `${process.env.REACT_APP_API_URL}`;



export default function ActivatePage(){
    
    
    const history = useHistory();
    const location = useLocation();
    const previusObjectURL = location.state?.form;
    const auth = useAuth();
    const code_activate = useRef();
    
    
    
    const [datos, setDatos] = useState({
        code_activate:'',
        
    });
    const [estado, setEstado] = useState({
        error:false,
        message_error:''
    })

    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        setEstado({error:false, message_error:''});
    }
    /*
    Nombre autor : Eduardo Bernal
    Fecha creacion : 20/04/2022
    Descripccion : Verifica codigo de activacion enviado por email en registro de usuario
    */
    const activarUsuario = async  (event) => {
        event.preventDefault();

        if( datos.code_activate.trim() === ''){
            code_activate.current.focus();
            setEstado({error:true, message_error:'Ingrese el c\u00F3digo de activaci\u00F3n'});
            return;
        }
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
            method: 'post',
            url: baseURL+'/usuario/activar/',
            headers: {
                'Authorization': `Bearer ${ token }`
            },
            data:{
                'id':user.id,
                'code':datos.code_activate
            }
        })
        .then(response =>{

            Swal.fire({
            icon: 'success',
            html : response.data.message,
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
                auth.refreshStaff(true);
                history.push('/');
                

            }
            })
            
            
        }).catch(error => {

            setDatos({code_activate:''});
            if(!error.status)
               auth.onError()
            auth.onErrorMessage(error.response.data.message);
            
            
        });


        
        
    }

    
    /*
    Nombre autor : Eduardo Bernal
    Fecha creacion : 21/04/2022
    Descripccion : Reenvia codigo de activacion a email de usuario
    */
    const reenviarCodigo = async () => {


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


        Swal.fire({
        title: '',
        html: "El correo de confirmaci\u00F3n puede encontrarce en la carpeta de spam<br><strong>\u00bfDesea reenviar el c\u00F3digo\u003F</strong>",
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowEscapeKey : false,
        allowOutsideClick: false
        }).then((result) => {
            
            if(result.value){
                
                axios({
                method: 'post',
                url: baseURL+'/usuario/reenviar_codigo/',
                headers: {
                    'Authorization': `Bearer ${ token }`
                },
                data:{
                    'id':user.id,
                }
                })
                .then(response =>{
                    
                    Swal.fire({
                    icon: 'success',
                    html : response.data.message,
                    showCancelButton: false,
                    focusConfirm: false,
                    allowEscapeKey : false,
                    allowOutsideClick: false,
                    confirmButtonText:'Aceptar',
                    confirmButtonColor: '#39ace7',
                    preConfirm: () => {
        
                    }
                    })
                }).catch(error => {
        
                    if(!error.status)
                       auth.onError()
                    auth.onErrorMessage(error.response.data.message);
                    
                    
                });

            }//end-if
        })




    }




    
    return(
        <div className="wrapper fadeInDown">
            <div id = "formContent">
                <div className = "fadeIn first">
                    <img src={logo} width = "100" alt="User Icon" />
                <br/>
                <br/>
                </div>
                <form onSubmit = {activarUsuario} >
                    <input  type="text" className="entry_text fadeIn second" name="code_activate" ref = {code_activate} value = {datos.code_activate} 
                            placeholder="C&oacute;digo de activaci&oacute;n" onChange = {handleInputChange} maxLength="8" 
                            title = "C&oacute;digo de activaci&oacute;n enviado a correo electr&oacute;nico" 
                    />
                    <img  className = "image" src = {email} width = "30" height = "30" alt="User Icon" title= "Reenviar c&oacute;digo" onClick = {reenviarCodigo} />
                    <input type="submit" className="fadeIn fourth" value="Aceptar"  /> 
                </form>

                

                {estado.error === true &&
                    <div className = "alert alert-danger" role="alert" >
                        {estado.message_error}
                    </div>
                }
            </div>
        </div>
        
    )

}