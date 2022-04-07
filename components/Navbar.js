import {NavLink} from 'react-router-dom';
import useAuth from '../auth/useAuth';
import logo from '../assetss/images/logo.png';

export default function Navbar(){
    const auth = useAuth();
    return(
        <nav className = "navbar navbar-expand-lg navbar-dark bg-primary" >
            <div className = "container-fluid">

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className = "navbar-header">
                    <ul className = "navbar-nav">
                        <li className = "nav-item" >
                            {/* 
                            <img src = {require('/home/hsu/Documentos/entornos_virtuales/react_front/aplicacion/src/assetss/images/log.png')} alt="" width="30" height="24" />
                            */}
                            <NavLink exact to = "/" className = "nav-link logo" activeClassName = "active" >
                                <img src={logo} width = "40" height = "40" alt="User Icon" />
                                AGEPI
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav" >
                    <ul className = "navbar-nav">
                        {!auth.isLogged() && (
                            <>
                            <li className = "nav-item">
                                <NavLink exact to = "/iniciar_sesion" className = "nav-link" activeClassName = "active" ><span className = "glyphicon glyphicon-user"></span>Iniciar sesion</NavLink>
                            </li>
                            <li className = "nav-item" >
                                <NavLink exact to = "/registrarce" className = "nav-link" activeClassName = "active" >Registrarce</NavLink>                                
                            </li>
                            </>
                        )}
                    
                        {auth.isLogged() && (
                        <>
                        

                            <li className = "nav-item">
                                <NavLink exact to = "/registar_firma" className = "nav-link" activeClassName = "active" >Registar firma</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink exact to = "/protocolos" className = "nav-link" activeClassName = "active" >Protocolos</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink exact to = "/registro_protocolo" className = "nav-link" activeClassName = "active" >Registro protocolo</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink exact to = "/registrar_equipo" className = "nav-link" activeClassName = "active" >Registro equipo</NavLink>
                            </li>
                            <li className = "nav-item" >
                                <NavLink exact to = "/solicitudes_firma" className = "nav-link" activeClassName = "active" >Solicitudes firma</NavLink>
                            </li>
                            <li className = "nav-item" >
                                <NavLink exact to = "/equipo" className = "nav-link" activeClassName = "active" >Equipo</NavLink>
                            </li>
                            <li className = "nav-item" >
                                <NavLink exact to = "/validar_firmas" className = "nav-link" activeClassName = "active" >Validar firmas</NavLink>
                            </li>
                            
                            <li className = "nav-item dropdown" >
                                <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Opcciones
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <li>
                                        <div className = "dropdown-item">
                                            Salir
                                        </div>
                                    </li>
                                </ul>

                                <button onClick = {auth.logout}>Logout</button>
                            </li>
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                            &nbsp;
                        </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}