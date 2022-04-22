import {Route, Redirect} from 'react-router-dom';
import useAuth from '../auth/useAuth';

//const user = null;
//const user = {id:1, username:'luis50'};

export default function PrivateRoute({component:Component, ...rest}){
    const auth = useAuth();

    return(
        <Route {...rest}>
            {auth.isLoggedPriv(rest.location.pathname) ? (<Component />):(<Redirect to ="/iniciar_sesion" />)}
        </Route> 
    )
}