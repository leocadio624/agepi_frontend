import React, {useEffect} from 'react';

//import {BrowserRouter as Router, Route} from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';


import Home from '../pages/HomePage';
import NotFound from '../pages/NotFoundPage';
import Login from '../pages/LoginPage';
import Register from '../pages/RegisterPage';


//import Notifications from '../components/NotificationsPage';
import ProtocolState from '../pages/ProtocolStatePage';

import Comunidad from '../pages/ComunidadPage';
import RegisterSign from '../pages/RegisterSignPage';
import Protocols from '../pages/ProtocolsPage';
import RegisterProtocol from '../pages/RegisterProtocolPage';
import RegisterTeam from '../pages/RegisterTeamPage';
import SigningRequest from '../pages/SigningRequestPage';
import Team from '../pages/TeamPage';
import ValidateSigns from '../pages/ValidateSignsPage';
import Activate from '../pages/ActivatePage';



import Navbar from '../components/Navbar';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';











export default function AppRouter(){

    useEffect(() => {
        
    });
    return(
        
            <Router>
                <Navbar />
                <Switch>
                    
                    {/*

                    <Route exact path = "/profile/:username"  component = {profile}/>
                    <Route exact path = "/categories"  component = {categories}/>
    
                    <PublicRoute exact path = "/login"  component = {login} />
                    <PublicRoute exact path = "/register"  component = {register} />
    
    
                    <PrivateRoute exact path = "/dashboard"  component = {DashBoard}/>
    
    
                    <Route exact path = "/" component = {Home} />
                    <Route path = "*" component = {NotFound} />
                    */}

                    <PublicRoute exact path = "/" component = {Home} />
                    <PublicRoute exact path = "/iniciar_sesion"  component = {Login} />
                    <PublicRoute exact path = "/registrarce"  component = {Register} />
                    

                    
                    {/*    
                    */}


                    <PrivateRoute exact path = "/estado_protocolo"  component = {ProtocolState} />
                    <PrivateRoute exact path = "/comunidad"  component = {Comunidad} />
                    <PrivateRoute exact path = "/registar_firma"  component = {RegisterSign} />
                    <PrivateRoute exact path = "/protocolos"  component = {Protocols}/>
                    <PrivateRoute exact path = "/registro_protocolo"  component = {RegisterProtocol}/>
                    <PrivateRoute exact path = "/registrar_equipo"  component = {RegisterTeam}/>
                    <PrivateRoute exact path = "/solicitudes_firma"  component = {SigningRequest}/>
                    <PrivateRoute exact path = "/equipo"  component = {Team}/>
                    <PrivateRoute exact path = "/validar_firmas"  component = {ValidateSigns}/>
                    <PrivateRoute exact path = "/activar_usuario"  component = {Activate}/>
                
                    
                        

                    
    
                    
                    
                    <Route path = "*" component = {NotFound} />
                    
                </Switch>
                

            </Router>



    )
}