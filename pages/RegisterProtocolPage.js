import React, {useState, useEffect, useRef} from 'react';
import logo from '../assetss/images/user.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import save from '../assetss/images/save-file.png';
import cancel from '../assetss/images/cancelar.png';
import add from '../assetss/images/plus.png';



const baseURL = `${process.env.REACT_APP_API_URL}`;

export default function RegisterPage(){

    
    const sumary = useRef();
    const countSumary = useRef();
    const file_ref = useRef();
    const form_ref = useRef();
    

    const [datos, setDatos] = useState({
        title       : '',
        sumary      : '',
        file        : ''
    })

    /*
    */


    const [period, setPeriod] = useState(-1);
    const [typeRegister, setTypeRegister] = useState(-1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [keyList, setKeyList] = useState( [ {key:""} ] );

    

    
    

    
            
    
    

    //const {register, handleSubmit} = useForm();

   

    /*
    useEffect(() => {
        (async () =>{
            console.log('use effect')
            return;
            
        })();
        
        
        
    },[estado]);
    */

    useEffect(() => {
        //updateContadorTa(sumary.current, countSumary.current, 4000);
        //setPeriod(-1);

    });


    /*
    const [estado, setEstado] = useState(false);
    */
        
    
    



    const handleInputChange = (event) => {

        setDatos({
            ...datos,
            [event.target.name]:event.target.value
        })
        
        if( event.target.name === 'sumary')
            updateContadorTa(sumary.current, countSumary.current, 4000);
        
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

        console.log(keyList);
        

    }

    function updateContadorTa(ta, contador, max){

        contador.innerHTML = "0/" + max;
        contador.innerHTML = ta.value.length + "/" + max;

        
        if( parseInt(ta.value.length) > max ){
            ta.value = ta.value.substring(0, max-1);
            contador.innetHTML = max + "/" + max;
        }

    }

    const guardarProtocolo = () => {
        
        


        var formData = new FormData( form_ref.current );
        formData.append('protocol_state', 1);
        

        axios.post(
            baseURL+'/protocolos/protocolos/',
            formData
        )
        .then(response => {
            console.log(response)
        }).catch(error => {
        


        })
        
        
        /*
        console.log(period);
        console.log(typeRegister);
        console.log(selectedFile);
        */

    }

    const cleanForm = () => {

        file_ref.current.value = null;
        setSelectedFile(null);

    }

    

    
    

    return(

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
                        <input className = "form-control" type="text" name = "title" placeholder = "Titulo de protocolo" onChange = {handleInputChange} />
                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Resumen</div>
                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <textarea  ref={sumary}  className = "form-control" name = "sumary" rows="3" onChange = {handleInputChange} ></textarea>
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
                            onChange = {(e) =>{
                                setPeriod(e.target.value);
                            }}
                        >
                            <option value = "-1"  >Seleccione una opcci&oacute;n</option>
                            <option value = "2" >2</option>
                            <option value = "3" >3</option>
                            <option value = "4" >4</option>
                        </select>

                    </div>
                    <div className = "col-lg-2 col-md-2 col-sm-6 d-flex justify-content-center">
                        <div className = "label-form" >Tipo de registro</div>

                    </div>
                    <div className = "col-lg-4 col-md-4 col-sm-6">
                        <select className = "form-select"
                            value = {typeRegister}
                            onChange = {(e) =>{
                                setTypeRegister(e.target.value);
                            }}
                        >
                            <option value = "-1">Seleccione una opcci&oacute;n</option>
                            <option value = "1" >Inicial</option>
                            <option value = "2" >Complementario</option>
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
            {/*
            const [keyList, setKeyList] = useState( [ {key:""} ] );
            */}


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
                                {keyList.length - 1 === index && keyList.length < 6 &&(
                                    <img className="image" src={add} onClick = {handleAddKey} width = "30" height = "30" alt="User Icon" title= "Agregar palabra clave" />
                                )}
                            </div>
                            <div className = "col-3" >
                                {keyList.length > 1 &&(
                                    <img className="image" src={cancel} onClick = {() => handleRemoveKey(index)} width = "30" height = "30" alt="User Icon" title= "Quitar palabra clave" />
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
        
        
    )
}