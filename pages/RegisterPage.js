import React, {useState, useEffect} from 'react';
import logo from '../assetss/images/user.png';
import axios from 'axios';
import Swal from 'sweetalert2';
const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function RegisterPage(){

    const [datos, setDatos] = useState({
        name:'',
        lastname:'',
        email:'',
        password:'',
        confirm_password:''  
    })
    
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


    const registarUsuario = (event) => {
        event.preventDefault();

    
        var is_student = false;
        var is_employe = false;
        
        var RegExPatternProfesor = /^[\w-\.]{3,}@ipn\.mx$/;
        var RegExPatternAlumno = /^[\w-\.]{3,}@alumno.ipn\.mx$/;
        

        
        if( datos.name.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese su nombre completo'});
            return;
        }else if( datos.lastname.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese sus apellidos'});
            return;
        }else if( datos.email.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese su correo electr\u00F3nico institucional'});
            return;
        }else if( (datos.email).match(RegExPatternProfesor) == null && (datos.email).match(RegExPatternAlumno) == null ){
            setEstado({error:true, message_error:'El correo electr\u00F3nico proporcionado no es un correo institucional'});
            return;
        }else if( datos.password.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese una contrase\u00F1a'});
            return;
        }else if( datos.confirm_password.trim() === '' ){
            setEstado({error:true, message_error:'Confirme su contrase\u00F1a'});
            return;
        }else if( datos.password !== datos.confirm_password ){
            setEstado({error:true, message_error:'Las contrase\u00F1as no coinciden'});
            return;
        }
        


        is_student = Array.isArray( datos.email.match(RegExPatternAlumno) ) ? true : false;
        is_employe = !is_student;

        axios.post(
            baseURL+'/usuario/usuario/',
            {
            "password"      : datos.password,
            "is_superuser"  : true,
            "username"      : datos.email,
            "email"         : datos.email,
            "name"          : datos.name,
            "last_name"     : datos.lastname,
            "is_student"    : is_student,
            "is_employe"    : is_employe,
            "is_active"     : true,
            "is_staff"      : true
            }
        )
        .then(response => {

            if(response.status === 200){
                Swal.fire({
                icon: 'success',
                html : 'Se ha creado el usuario correctamente',
                showCancelButton: false,
                focusConfirm: false,
                allowEscapeKey : false,
                allowOutsideClick: false,
                confirmButtonText:'Aceptar',
                confirmButtonColor: '#39ace7',
                preConfirm: () => {
                }
                })

            }else if(response.status === 226){
                
                Swal.fire({
                icon: 'info',
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

            }
            

        }).catch(error => {
        
            if(!error.status){

                Swal.fire({
                title: 'Error',
                icon: 'error',
                html : 'Ocurri&oacute; una interrupci\u00F3n en la conexi\u00F3n, favor de reintentar la operaci\u00F3n.',
                showCancelButton: false,
                focusConfirm: false,
                allowEscapeKey : false,
                allowOutsideClick: false,
                confirmButtonText:'Aceptar',
                confirmButtonColor: '#39ace7',
                preConfirm: () => {
            
                }
                })
                
            }
            Swal.fire({
            title: 'Error',
            icon: 'error',
            html : error.response.data.message,
            showCancelButton: false,
            focusConfirm: false,
            allowEscapeKey : false,
            allowOutsideClick: false,
            confirmButtonText:'Aceptar',
            confirmButtonColor: '#39ace7',
            preConfirm: () => {
        
            }
            })

        })

    }
    return(

        <div className="wrapper fadeInDown">
            <div id = "formContent">
                <div className = "fadeIn first">
                
                    <br/>
                    <img src={logo} width = "50" height = "50" alt="User Icon" />
                    <br/>
                </div>
                <form onSubmit = {registarUsuario} >
                    
                    
                    <input type="text" className="entry_text fadeIn first" name="name"  placeholder="Nombre completo" onChange = {handleInputChange} />
                    <input type="text" className="entry_text fadeIn second" name="lastname"  placeholder="Apellidos" onChange = {handleInputChange} />
                    <input type="text" className="entry_text fadeIn second" name="email"  placeholder="Correo electr&oacute;nico institucional" onChange = {handleInputChange} />
                    <input type="password" className="entry_psw fadeIn third" name="password" placeholder="Contrase&ntilde;a" onChange = {handleInputChange} />
                    <input type="password" className="entry_psw fadeIn third" name="confirm_password" placeholder="Confirmaci&oacute;n contrase&ntilde;a" onChange = {handleInputChange} />

                    <input type="submit" className="fadeIn fourth" value="Registrarce"  /> 
                    

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