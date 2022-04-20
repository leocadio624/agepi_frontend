import {Route, Redirect, useHistory} from 'react-router-dom';
import useAuth from '../auth/useAuth';



export default function ResponsableRoute({component:Component, ...rest}){

    //const history = useHistory();
    //let redirect = '/comunidad';
    const auth = useAuth();

    const a = 6;

    
    
    console.log( auth.is_active() )
    

    

    
    
    return(
        <Route {...rest}>
            { auth.isLogged() ? (<Component />):(<Redirect to = {auth.is_Staff()} />)}
        </Route>
            
    )
}