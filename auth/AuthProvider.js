import {createContext, useState, useEffect} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
const baseURL = `${process.env.REACT_APP_API_URL}`;

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    useEffect(() => {
        try{
            localStorage.setItem('user', JSON.stringify(user));

        }catch(error){
            localStorage.remove('user');
        }
    },[user]);
    /*
    Nombre autor : Eduardo Bernal
    Fecha creacion : 23/03/2021
    Descripccion : Almacena credenciales de usuario en localstorage
    */ 
    const contextValue = {
        user,
        login(datos){    

                    
            axios({
                method: 'post',
                url: baseURL+'/login/',
                data:{
                    "username": datos.user,
                    "password": datos.password
                }
            })
            .then(response =>{

                
                setUser({   'token'             :response.data.token,
                            'refresh_token'     :response.data.refresh_token,
                            'id'                :response.data.user.id,
                            'username'          :response.data.user.username,
                            'email'             :response.data.user.email,
                            'name'              :response.data.user.name,
                            'last_name'         :response.data.user.last_name
                        })                
                
                
                
                        
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

                
            });


        }, 
        logout(){
            setUser(null);
        },
        isLogged(){
            return !!user;
        },
        /*
        * Descripcion:	Actualiza el token de acceso en el estado y local storage
        * Fecha de la creacion:		13/04/2022
        * Author:					Eduardo B 
        */
        refreshToken(token){

            setUser({   
                    'token'             :token,
                    'refresh_token'     :user.refresh_token,
                    'id'                :user.id,
                    'username'          :user.username,
                    'email'             :user.email,
                    'name'              :user.name,
                    'last_name'         :user.last_name
                    })

        },
        /*
        * Descripcion:	Se muestra en error 500
        * Fecha de la creacion:		08/04/2022
        * Author:					Eduardo B 
        */
        onError(){
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

        },
        /*
        * Descripcion:	Se muestra en errores controlados por la API
        * Fecha de la creacion:		08/04/2022
        * Author:					Eduardo B 
        */
        onErrorMessage(str){
            Swal.fire({
            title: 'Error',
            icon: 'warning',
            html : str,
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
    }

    return <AuthContext.Provider value = {contextValue} >
        {children}
        </AuthContext.Provider>

}
export default AuthProvider;