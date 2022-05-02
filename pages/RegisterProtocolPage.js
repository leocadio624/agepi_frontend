import React, {useState, useEffect, useRef} from 'react';




import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../auth/useAuth';
import { fetchWithToken } from "../helpers/fetch";



import save from '../assetss/images/save-file.png';
import cancel from '../assetss/images/cancelar.png';
import add from '../assetss/images/plus.png';

const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function RegisterPage(){

    
    const auth = useAuth();
    const ref_title = useRef();
    const ref_sumary = useRef();
    const ref_inscripccion = useRef();
    const ref_periodo = useRef();
    const file_ref = useRef();
    

    const countSumary = useRef();
    const form_ref = useRef();

    
    

    const [datos, setDatos] = useState({
        title       : '',
        sumary      : '',
        file        : ''
    })

    
    const [period, setPeriod] = useState('-1');
    const [typeRegister, setTypeRegister] = useState('-1');

    const [periodos, setPeriodos] = useState([]);
    const [inscripcciones, setInscripcciones] = useState([]);




    const [selectedFile, setSelectedFile] = useState(null);
    const [keyList, setKeyList] = useState( [ {key:""} ] );

    

    useEffect(() => {
        startModule();
        
    },[]);



        
    



    const handleInputChange = (event) => {

        setDatos({
            ...datos,
            [event.target.name]:(event.target.value).trim()
        })
        
        if( event.target.name === 'sumary')
            updateContadorTa(ref_sumary.current, countSumary.current, 4000);
        
    }
    const handleAddKey = () => {
        setKeyList([...keyList, {key:""}])
    }

    const handleRemoveKey = (index) => {
        const list = [...keyList];
        list.splice(index, 1);
        setKeyList(list);

    }
    const handleKeyChange = (e, index) =>{
        const {name, value} = e.target;
        const list = [...keyList];
        list[index][name] = value;
        setKeyList(list);

        
        

    }

    function updateContadorTa(ta, contador, max){

        contador.innerHTML = "0/" + max;
        contador.innerHTML = ta.value.length + "/" + max;

        
        if( parseInt(ta.value.length) > max ){
            ta.value = ta.value.substring(0, max-1);
            contador.innetHTML = max + "/" + max;
        }

    }

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
        method: 'get',
        url: baseURL+'/protocolos/start_module/',
        headers: {
            'Authorization': `Bearer ${ token }`
        }
        })
        .then(response =>{            
            
            setPeriodos(response.data.periodos);
            setInscripcciones(response.data.inscripcciones);


            
        }).catch(error =>{
            if(!error.status)
                auth.onError()
            auth.onErrorMessage(error.response.data.message);

        });


    }

    const guardarProtocolo = async () => {

        const   user = JSON.parse(localStorage.getItem('user'));    
        let response = null;
        let indice = 1;


        if(datos.title === ''){
            auth.swalFire('Ingrese un t\u00EDtulo de protocolo');
            ref_title.current.focus()
            return;
        }
        if(datos.sumary === ''){
            auth.swalFire('Ingrese un resumen de protocolo');
            ref_sumary.current.focus()
            return;
        }
        if(parseInt(period) === -1){
            auth.swalFire('Seleccione un per\u00EDodo escolar');
            ref_periodo.current.focus()
            return;
        }
        if(parseInt(typeRegister) === -1){
            auth.swalFire('Seleccione un tipo de registro');
            ref_inscripccion.current.focus()
            return;
        }
        if(selectedFile === null){
            auth.swalFire('Seleccione el archivo de t\u00FA protocolo en formato PDF');
            file_ref.current.focus()
            return;
        }
        if(keyList.length < 6){
            auth.swalFire('Debe de ingresar al menos 6 palabras clave');
            return;
        }
        keyList.forEach(function(i){ 
            if( (i.key).trim() === ''){
                auth.swalFire('Ingrese el valor de la palabra clave '+(indice)+'');
                return;
            }
            indice += 1
        });


        var keyWords = [];
        keyList.forEach(function(i){ keyWords.push((i.key).trim()) });

        var formData = new FormData( form_ref.current );
        formData.append('pk_user', user.id);
        formData.append('fk_protocol_state', 1);
        formData.append('fk_periodo', period);
        formData.append('fk_inscripccion', typeRegister);
        formData.append('keyWords', keyWords);

        try{
            response = await fetchWithToken('api/token/refresh/',{'refresh':user.refresh_token},'post');
        }catch(error){
            if(!error.status)
            auth.onError()
        }
        const body = await response.json();
        const  token = body.access || '';
        auth.refreshToken(token);
        

       let headers = {'Authorization': `Bearer ${ token }`}
        axios.post(
            baseURL+'/protocolos/protocolos/',
            formData,
            headers
        )
        .then(response => {
            console.log(response.data)
            
        }).catch(error => {
        
        })
        
        

    }

    const cleanForm = () => {

        file_ref.current.value = null;
        setSelectedFile(null);

    }

    

    
    

    return(
        
        <div>
        {periodos.length !== 0 && inscripcciones.length !== 0 &&
        <>
        <div className = "container panel shadow">
            <div className = "row panel-header">
                <div className = "col-12 d-flex justify-content-center">
                    <div className = "title" >Registro de protocolo</div>
                </div>
            </div>
            
            <form ref={form_ref}  encType="multipart/form-data">
                <div className= "row row-form" >
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >T&iacute;tulo</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6"> 
                        <input ref={ref_title} className = "form-control" type="text" name = "title" placeholder = "Titulo de protocolo" onChange = {handleInputChange} />
                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Resumen</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <textarea  ref={ref_sumary}  className = "form-control" name = "sumary" rows="3" onChange = {handleInputChange} ></textarea>
                        <blockquote className="blockquote text-center">
                            <p  ref={countSumary} className = "mb-0 font-weight-lighter" style ={{fontSize:13}} >0/4000</p>
                        </blockquote>
                        <blockquote className="blockquote text-center">
                            <footer className="blockquote-footer font-weight-lighter" style ={{fontSize:13}} >M&aacute;ximo 4000 car&aacute;cteres</footer>
                        </blockquote>
                    </div>
                </div>

            


            
            
                <div className = "row row-form">
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Per&iacute;odo escolar</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                    
                        <select className = "form-select" 
                            value = {period}
                            ref={ref_periodo}
                            onChange = {(e) =>{
                                setPeriod(e.target.value);
                            }}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            {periodos.map((obj, index) =>(
                                <option key = {index} value = {obj.id} >{obj.periodo}</option>
                            ))}
                        </select>

                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Tipo de registro</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <select className = "form-select"
                            value = {typeRegister}
                            ref={ref_inscripccion}
                            onChange = {(e) =>{
                                setTypeRegister(e.target.value);
                            }}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            {inscripcciones.map((obj, index) =>(
                                <option key = {index} value = {obj.id} >{obj.descp}</option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className = "row row-form">
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Archivo</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <input className = "form-control" ref = {file_ref} name = "fileProtocol" type="file" 
                            onChange = {(e) => {

                                const nameFile = e.target.files[0].name;
                                const sizeFile = e.target.files[0].size;
                                                            
                                if(nameFile.toLowerCase().match(/([^\s]*(?=\.(pdf))\.\2)/gm)!=null){                                
                                    if(sizeFile <= 15728640){
                                        setSelectedFile(e.target.files[0]);
                                        
                                    }else{

                                        Swal.fire({
                                        icon: 'info',
                                        html : "El archivo no puede ser mayor a 15 MB",
                                        showCancelButton: false,
                                        focusConfirm: false,
                                        allowEscapeKey : false,
                                        allowOutsideClick: false,
                                        confirmButtonText:'Aceptar',
                                        confirmButtonColor: '#39ace7',
                                        preConfirm: () => {
                                            file_ref.current.value = null;
                                            setSelectedFile(null);
                                            
        
                                        }
                                        })
                                    }
                                }else{
                                    
                                    Swal.fire({
                                    icon: 'info',
                                    html : 'El formato del archivo debe ser PDF',
                                    showCancelButton: false,
                                    focusConfirm: false,
                                    allowEscapeKey : false,
                                    allowOutsideClick: false,
                                    confirmButtonText:'Aceptar',
                                    confirmButtonColor: '#39ace7',
                                    preConfirm: () => {
                                        file_ref.current.value = null;
                                        setSelectedFile(null);

                                    }
                                    })
                                }


                            }} 
                        />
                    </div>
                </div>
            </form>

            <form className = "" autoComplete = "off">
                <div className = "">

                    <div className = "row row-form">
                        <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                            <div className = "label-form" >Palabra(s) clave</div>
                        </div>
                    </div>
                    
                    {keyList.map((singleKey, index) =>(

                        <div key = {index} className = "row" >
                            <div className = "col-3" style = {{marginTop:5}} >
                                <input name = "key" className = "form-control" type = "text" id = "key" required
                                value = {singleKey.key}
                                onChange = {(e) => handleKeyChange(e, index)}

                                />
                                {keyList.length - 1 === index && keyList.length < 10 &&(
                                    <img className="image2" src={add} onClick = {handleAddKey} width = "30" height = "30" alt="User Icon" title= "Agregar palabra clave" />
                                )}
                            </div>
                            <div className = "col-3" >
                                {keyList.length > 1 &&(
                                    <img className="image2" src={cancel} onClick = {() => handleRemoveKey(index)} width = "30" height = "30" alt="User Icon" title= "Quitar palabra clave" />
                                )}
                            </div>
                        </div>

                    ))}

                </div>
            </form>


            <div className = "row panel-footer">
                <div className = "col-12 d-flex justify-content-center">
                    <img className="image" src={save} onClick = {guardarProtocolo} width = "30" height = "30" alt="User Icon" title= "Guardar protocolo" />
                    <button onClick = {cleanForm} >Borrar</button>
                </div>
            </div>

        </div>
        </>
        }
        { periodos.length === 0 && inscripcciones.length === 0 &&
        
            <div className = "row" style = {{marginTop:40}}>
                <div className = "col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                    <div className = "alert alert-info" role="alert" >
                        Aun no hay un per&iacute;odo de registro de protocolo abierto
                    </div>
                </div>
            </div>
        
        }
        { periodos.length === 0 ^ inscripcciones.length === 0 &&
        
            <div className = "row" style = {{marginTop:40}}>
                <div className = "col-lg-12 col-md-12 col-sm-12 d-flex justify-content-center">
                    <div className = "alert alert-info" role="alert" >
                        Aun no hay un per&iacute;odo de registro de protocolo abierto
                    </div>
                </div>
            </div>
        
        }


        </div>

        
        
    )
}