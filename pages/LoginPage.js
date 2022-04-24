import React, {useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import '../assetss/css/login.css';
import logo from '../assetss/images/logo.png';


export default function LoginPage(){
    
    
    const history = useHistory();
    const location = useLocation();
    const previusObjectURL = location.state?.form;
    const auth = useAuth();
    
    
    
    const [datos, setDatos] = useState({
        user:'',
        password:''
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

    const enviarDatos = (event) => {
        event.preventDefault();

        if( datos.user.trim() === ''){
            setEstado({error:true, message_error:'Ingrese su nombre de usuario'});
            return;

        }
        if( datos.password.trim() === ''){
            setEstado({error:true, message_error:'Ingrese su contrase\u00F1a'});
            return;
        }
        auth.login(datos);
        history.push(previusObjectURL || '/registar_firma');
        
    }
    return(
        <div className="wrapper fadeInDown">
            <div id = "formContent">
                <div className = "fadeIn first">
                <img src={logo} width = "100" alt="User Icon" />
                <br/>
                <br/>
                </div>
                <form onSubmit = {enviarDatos} >
                    <input type="text" className="entry_text fadeIn second" name="user"  placeholder="Usuario" onChange = {handleInputChange} title = "Correo electr&oacute;nico con el que realizaste tu registro"/>
                    <input type="password" className="entry_psw third" name="password" placeholder="Contraseña" onChange = {handleInputChange} />
                    <input type="submit" className="fadeIn fourth" value="Entrar"  /> 
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