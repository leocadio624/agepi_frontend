import {Route, Redirect} from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function PublicRoute({component:Component, ...rest}){
    let redirect = '/comunidad';
    const auth = useAuth();
    //const is_staff = false;

    /*
    try{
        if(auth.user.is_staff)
            redirect = '/comunidad'
        else
            redirect = '/activar_usuario'
        
    }catch(error){
    }
    */
    
    
    return(
        <Route {...rest}>
            {/*
            { !auth.isLogged() ? (<Component />):(<Redirect to = {auth.is_Staff()} />)}
            */}
            { !auth.isLogged() ? (<Component />):(<Redirect to = "/" />)}
        </Route>
            
    )
}