import React, {useState, useEffect, useRef} from 'react';
import user from '../assetss/images/user.png';

import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";

const baseURL = `${process.env.REACT_APP_API_URL}`;
export default function Team(){
    const auth = useAuth();

    const [equipo, setEquipo] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [nombreEquipo, setNombreEquipo] = useState('');
    const [estado, setEstado] = useState({
        error:false,
        message_error:''
    })
    

    useEffect(() => {
        startModule();
        
    },[]);

    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const startModule = async () =>{

        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        
        axios({
        method: 'post',
        url: baseURL+'/teams/team_member/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        data: {
            'fk_user': user.id
        }
        })
        .then(response =>{

            let equipos = response.data.equipos;
            
            if(equipos.length === 0){
                setEstado({error:true,message_error:'Aun no estas relacionado en un equipo'})
            }
            
            if(equipos.length === 1){
                setNombreEquipo(equipos[0].team);
                getTeam(equipos[0].fk_team);
            }else{
                setEquipos(response.data.equipos)
            }

            

        }).catch(error =>{
            auth.onError();    
        });


    }

    /*
    * Descripcion: Inicialializa el estado del modulo
    * Fecha de la creacion:		17/04/2022
    * Author:					Eduardo B 
    */
    const getTeam = async (id) =>{

        
        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        let id_team = parseInt(id);
        
        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);

        axios({
        method: 'get',
        url: baseURL+'/teams/members_by_team/',
        headers: {
            'Authorization': `Bearer ${ token }`
        },
        params: {
            'fk_team': id_team
        }
        })
        .then(response =>{
            setEquipo(response.data);
        }).catch(error =>{
            
        });
        

        
        
        

    }



    return(
        <div className = "container">

            {estado.error === true &&
                <div className = "row" style = {{marginTop:40}}>
                    <div className = "col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                        <div className = "alert alert-danger" role="alert" >
                            {estado.message_error}
                        </div>
                    </div>
                </div>
            }
            {equipos.length > 1 &&
                <div className = "row" style = {{marginTop:40}}>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Equipos a los que perteneces</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6"> 
                        <select className = "form-select" 
                            onChange = {(e) =>{
                                
                                if(parseInt(e.target.value) === -1){
                                    setNombreEquipo('')
                                    setEquipo([]);

                                }else{
                                    setNombreEquipo(e.target.options[e.target.selectedIndex].text)
                                    getTeam(e.target.value);
                                }
                                

                                
                            }}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            {equipos.map((obj, index) =>(
                                <option key = {index} value = {obj.fk_team} >{obj.team}</option>
                            ))}
                        </select>
                    </div>
                </div>
            }

            <div className = "row" style = {{marginTop:40}} >
                <div className = "col-12 d-flex justify-content-center">
                    <h3>{nombreEquipo}</h3>
                </div>
            </div>
            <div className = "row"  >
                {equipo.map((member, index) =>(
                    <div className = "col-lg-4 col-md-6 col-sm-12" key = {index}>
                        <div className="profile-card text-center shadow bg-light p-4 my-5 rounded-3">
                            <div className="profile-photo shadow">
                                <img src={user} width = "60"  height = "60" alt="profile Photo" className="img-fluid" />
                            </div>
                            <h3 className="pt-3 text-dark">{member.name} {member.last_name}</h3>
                            <p className="text-secondary">{member.email}</p>
                            <p className="text-secondary professionalSummary">{member.professionalSummary}</p>
                            {/*
                            <div className="social-links">
                                <ul>
                                    <li><a href="#"><i className="bi bi-facebook"></i></a></li>
                                    <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                                    <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                                    <li><a href="#"><i className="bi bi-linkedin"></i></a></li>                            
                                </ul>
                            </div>
                            */}
                            
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
    )
}