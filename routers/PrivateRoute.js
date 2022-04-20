import {Route, Redirect, useHistory, useLocation} from 'react-router-dom';
import useAuth from '../auth/useAuth';

//const user = null;
//const user = {id:1, username:'luis50'};



export default function PrivateRoute({component:Component, ...rest}){
    const auth = useAuth();
    
    //const location = useLocation();

    
    //console.log( auth.is_active() )
    const is_active = auth.is_active();


    //console.log( auth.getRolUser() )
    //console.log(component);
    

    

    /*
    try{
    }catch(error){
    }

    
    if (auth.user != null){  
        console.log('verifica');
    }
    */
   

    
    

    return(

        <Route {...rest}>
            
            <Redirect to ="/comunidad" />

            
            

            {/*
            {auth.isLogged() && is_active === true&&
            
                <Component />
                
            

            }
            {auth.isLogged() && is_active === false &&
                <Redirect to ="/activar_usuario" />
            }
            {!auth.isLogged() &&
                <Redirect to ="/iniciar_sesion" />
            }
            */}
            

        </Route>
        
        /*
        <Route {...rest}>
        {auth.isLogged() ? (<Component />):(<Redirect to ="/iniciar_sesion" />)}
        {auth.isLogged() ? (<Component />):(<Redirect to = {{pathname:"/iniciar_sesion", state :{from:location}}} />)}
        </Route>
        */
        
            
    )
}