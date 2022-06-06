import React, {useState} from 'react';
import logo from '../assetss/images/user.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../auth/useAuth';
import validator from 'validator';
import lupa from '../assetss/images/lupa.png';


const baseURL = `${process.env.REACT_APP_API_URL}`;


export default function RegisterPage(){
    
    
    const auth = useAuth();
    const [datos, setDatos] = useState({
        nombre:'',
        apellidos:'',
        correo:'',
        pass:'',
        confirm_pass:''  
    })
    
    const [estado, setEstado] = useState({
        error:false,
        message_error:''
    })
    const [passwordShown, setPasswordShown] = useState(false);



    const handleInputChange = (event) => {
        setDatos({
            ...datos,
            [event.target.name]:(event.target.value).trim()
        })
        setEstado({error:false, message_error:''});
        
        
    }


    const registarUsuario = (event) => {
        event.preventDefault();
        
        /*
        let value = 'me'
        console.log( validator.isStrongPassword(value, {minLength: 8, minLowercase: 1,minUppercase: 1, minNumbers: 1, minSymbols: 0}) )
        return;
        */

        

        let is_student = false;
        let is_employe = false;
        let rol_user = 0;
        
        let RegExPatternProfesor = /^[\w-\.]{3,}@ipn\.mx$/;
        let RegExPatternAlumno = /^[\w-\.]{3,}@alumno.ipn\.mx$/;
        

        
        if( datos.nombre.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese su nombre completo'});
            return;
        }else if( datos.apellidos.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese sus apellidos'});
            return;
        }else if( datos.correo.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese su correo electr\u00F3nico institucional'});
            return;
        }else if( (datos.correo).match(RegExPatternProfesor) == null && (datos.correo).match(RegExPatternAlumno) == null ){
            setEstado({error:true, message_error:'El correo electr\u00F3nico proporcionado no es un correo institucional'});
            return;
        }else if( datos.pass.trim() === '' ){
            setEstado({error:true, message_error:'Ingrese una contrase\u00F1a'});
            return;
        }
        /*
        else if( validator.isStrongPassword(datos.pass, {minLength: 8, minLowercase: 1,minUppercase: 1, minNumbers: 1, minSymbols: 0}) === false ){
            setEstado({error:true, message_error:'La contraseña no cumple con los requisitos, favor de verificarlo'});
            return;

        }
        */
        
        else if( datos.confirm_pass.trim() === '' ){
            setEstado({error:true, message_error:'Confirme su contrase\u00F1a'});
            return;
        }else if( datos.pass !== datos.confirm_pass ){
            setEstado({error:true, message_error:'Las contrase\u00F1as no coinciden'});
            return;
        }
        
        is_student = Array.isArray( datos.correo.match(RegExPatternAlumno) ) ? true : false;
        is_employe = !is_student;
        rol_user = is_student ? 1 : 2;
        


        axios.post(
            baseURL+'/usuario/usuario/',
            {
            "password"      : datos.pass,
            "is_superuser"  : true,
            "username"      : datos.correo,
            "email"         : datos.correo,
            "name"          : datos.nombre,
            "last_name"     : datos.apellidos,
            "is_student"    : is_student,
            "is_employe"    : is_employe,
            "is_active"     : true,
            "is_staff"      : false,
            "rol_user"      : rol_user
            }
        )
        .then(response => {

            if(response.status === 206 || response.status === 226){
                setEstado({error:true, message_error:response.data.message});
            }else if(response.status === 201){
                
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
                    
                    auth.login({"user": datos.correo, "password":datos.pass})
   
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
    /*
    * Descripcion: Muestra el password ingresado
    * 'Registrar firma'
    * Fecha de la creacion:		30/04/2022
    * Author:					Eduardo B 
    */
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };
    return(

        <div className="wrapper fadeInDown">
            <div id = "formContent">
                <div className = "fadeIn first">
                
                    <br/>
                    <img src={logo} width = "50" height = "50" alt="User Icon" />
                    <br/>
                </div>
                <form onSubmit = {registarUsuario}  >
                    
                    <input type="text" className="entry_text fadeIn first" name="nombre"  placeholder="Nombre completo" onChange = {handleInputChange} />
                    <input type="text" className="entry_text fadeIn second" name="apellidos"  placeholder="Apellidos" onChange = {handleInputChange} />
                    <input type="text" className="entry_text fadeIn second"  name="correo"  placeholder="Correo electr&oacute;nico institucional" onChange = {handleInputChange} />
                    <input  type={passwordShown ? "text" : "password"}
                            className={passwordShown ? "entry_text fadeIn third" : "entry_psw fadeIn third"}
                            name="pass"
                            placeholder="Contrase&ntilde;a" 
                            onChange = {handleInputChange} 
                            title = "La contraseña debe contener al menos ocho caracteres, una letra minúscula, una letra mayúscula y un caracter numérico"
                    />
                    <input  type={passwordShown ? "text" : "password"}
                            className={passwordShown ? "entry_text fadeIn third" : "entry_psw fadeIn third"}
                            name="confirm_pass"
                            placeholder="Confirmaci&oacute;n contrase&ntilde;a" 
                            onChange = {handleInputChange} 
                            title = "La contraseña debe contener al menos ocho caracteres, una letra minúscula, una letra mayúscula y un caracter numérico"
                    />
                    <input type="submit" className="fadeIn fourth" value="Registrarce"  />
                    <img    className="" src={lupa} 
                            onClick = {togglePassword} width = "20" height = "20" alt="User Icon"
                            title= {passwordShown ? "Ocultar contrase\u00F1a" : "Mostrar contrase\u00F1a"}  style={{cursor:"pointer"}}/>
                    
                    
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