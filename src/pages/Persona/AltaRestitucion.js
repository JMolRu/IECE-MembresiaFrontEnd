import Layout from '../Layout';
import helpers from '../../components/Helpers'

import { Link, Redirect } from 'react-router-dom';
import {
    Container, Row, Col, Form, FormGroup, Input, Button,
    FormFeedback, CardTitle, Card, CardBody, CardHeader, CardText, Label, Alert, Table
} from 'reactstrap';

import React, { Component, useEffect, useState } from 'react';

function AltaRestitucion() {
    //Estados
    const [opcionesPersonas, setOpcionesPersonas] = useState([])
    const [opcionesHogares, setOpcionesHogares] = useState([])
    const [data, setData] = useState({})
    const [transaccion, setTransaccion] = useState({})
    const [hogar, setHogar] = useState(null)
    const [jerarquia, setJerarquia] = useState(null)
    const [miembrosHogar, setMiembrosHogar] = useState([])
    const [mostrarHogar, setMostrarHogar] = useState(false)
    const [paises, setPaises] = useState([])
    const [estados, setEstados] = useState([])

    //LLamadas en renderizado
    useEffect(() => {
        helpers.authAxios.get("/Persona/GetPersonaRestitucion/227/true")
            .then(res => {
                setOpcionesPersonas(res.data.personas)
                console.log(opcionesPersonas)
            });
    }, [opcionesPersonas.length]);

    useEffect(() => {
        helpers.authAxios.get("/Hogar_Persona/GetListaHogares")
            .then(res => {
                setOpcionesHogares(res.data)
                console.log(opcionesHogares)
            });
    }, [opcionesHogares.length]);

    useEffect(() => {
        helpers.authAxios.get("/pais")
            .then(res => {
                setPaises(res.data)
                console.log(paises)
            });
    }, [paises.length]);

    //Manejo de eventos de datos generales
    const handlePersona = (value) => {
        helpers.authAxios.get(`/Persona/${value}`)
            .then(res => {
                setData(res.data)
            })
            .then(() => {
                setData( prevState => ({
                    ...prevState,
                    per_Activo: true,
                    per_En_Comunion: true,
                    per_Visibilidad_Abierta: false
                }))
            })
    };
    const handleCategoria = (value) => {
        setData( prevState => ({
            ...prevState,
            per_Categoria: value
        }))
    };
    const handleComentario = (value) => {
        setTransaccion( prevState => ({
            ...prevState,
            comentario: value
        }))
    };
    const handleFechaTransaccion = (value) => {
        console.log(value)
        if(value == "") setMostrarHogar(false)
    
        setTransaccion( prevState => ({
            ...prevState,
            fecha_transaccion: value
        }))
    };

    //Manejo de eventos de hogar
    const handleHogar = (value) => {
        if(value == 0){
            setHogar(null)
        }
        helpers.authAxios.get(`/Hogar_Persona/GetDatosHogarDomicilio/${value}`)
            .then(res => {
                setHogar(res.data[0])
            });
        helpers.authAxios.get(`/Hogar_Persona/GetMiembros/${value}`)
            .then(res => {
                setMiembrosHogar(res.data)
            });
            console.log(hogar)
            console.log(miembrosHogar)

    };
    const handleJerarquia = (value) => {
        setJerarquia(value)
    };
    const handlePais = (value) => {
        if (value === "151" || value === "66" || value === "40"){
            helpers.authAxios.get(`/Estado/GetEstadoByIdPais/${value}`)
                .then(res => {
                    setEstados(res.data.estados)
                });
            }
    };
    const handleEstado = (value) => {
    };
    
    //Validaciones
    const validarDatosPersona = () => {
        if(!data.per_Id_Persona || data.per_Id_Persona == 0){
            alert('Seleccione una persona')
            return
        };
        if(transaccion.fecha_transaccion == null || !transaccion.fecha_transaccion ){
            alert('Seleccione una fecha para la transacción')
            return
        }
        setMostrarHogar(true)
    };
    //Pruebas
    const postData = () => {
        helpers.authAxios.post(`/Persona/Post/${data.per_Id_Persona}`, data)
            .then(res => {
                console.log(res)
            });
        helpers.authAxios.post(`/Persona/AddPersonaHogar/${jerarquia}/${hogar.hd_Id_Hogar}`, data)
            .then(res => {
                console.log(res)
            });
    };
    return(
        <Layout>
            <Container>
                <Card body className="mb-5">
                    <CardTitle className="text-center" tag="h4">
                        Alta Restitución
                    </CardTitle>
                    <Form>
                        <FormGroup row>
                            <Label for='NombrePersona' sm={3}>
                                <h5>Persona: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='NombrePersona'
                                name='nombre'
                                type='select'
                                onChange={e => {handlePersona(e.target.value)}}>
                                <option value="0" selected disabled>Selecionar persona...</option>
                                {opcionesPersonas.map(persona => (
                                    <option key={persona.per_Id_Persona} value={persona.per_Id_Persona}>{persona.per_Nombre + ' ' + persona.per_Apellido_Paterno + ' ' + persona.per_Apellido_Materno}</option>
                                ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Categoria' sm={3}>
                                <h5>Categoria: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Categoria'
                                name='categoria'
                                type='select'
                                value={data.per_Categoria}
                                onChange={(e) => handleCategoria( e.target.value )}
                               >
                                <option value="0" selected disabled >Selecionar categoria</option>
                                <option value="ADULTO_HOMBRE">Adulto Hombre</option>
                                <option value="ADULTO_MUJER">Adulto Mujer</option>
                                <option value="JOVEN_HOMBRE">Joven hombre</option>
                                <option value="JOVEN_MUJER">Joven mujer</option>

                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Comentario' sm={3}>
                                <h5>Comentario: (opcional) </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Comentario'
                                name='comentario'
                                type='textarea'
                                onInput={(e) => handleComentario( e.target.value )}>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for='Fecha' sm={3}>
                                <h5>Fecha de transaccion: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Fecha'
                                name='fecha'
                                type='date'
                                onChange={(e) => handleFechaTransaccion( e.target.value )}>
                                </Input>
                            </Col>
                        </FormGroup>
                        <Row className="text-center">
                            <Col>
                                <Button color="danger" size='lg'>
                                    Cancelar
                                </Button>
                            </Col>
                            <Col>
                                <Button color="primary" size='lg' onClick={e => validarDatosPersona()}>
                                    Proceder
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                {/* Hogar */}
                { mostrarHogar &&
                <Card body className="mb-5">
                    <CardTitle className="text-center" tag="h4">
                        Hogar / Domicilio
                    </CardTitle>
                    <Alert color="info">
                        <h5><strong>AVISO:</strong> Al seleccionar la opcion "Nuevo hogar / domicilio" debera completar los campos necesarios.</h5>
                    </Alert>
                    <FormGroup row>
                        <Label for='Hogar' sm={3}>
                            <h5>Asignar a hogar: </h5>
                        </Label>
                        <Col sm={9}>
                            <Input
                            id='Hogar'
                            name='hogar'
                            type='select'
                            onChange={e => {handleHogar(e.target.value)}}>
                            <option value="0" selected>Nuevo hogar / domicilio</option>
                            {opcionesHogares.map(hogar => (
                                <option key={hogar.hd_Id_Hogar} value={hogar.hd_Id_Hogar}>{hogar.per_Nombre + ' ' + hogar.per_Apellido_Paterno + ' ' + hogar.per_Apellido_Materno}</option>
                            ))}
                            </Input>
                        </Col>
                    </FormGroup>
                    {hogar ? 
                    <Form>
                        <Alert color="warning">
                            <h5><strong>ATENCION:</strong></h5>
                            <ul>
                                <li>Debe establecer una jerarquia para la persona que esta registrando, siendo la jerarquia 1 el representante del hogar.</li>
                                <li>Solo puede seleccionar una jerarquia entre 1 y la jerarquia mas baja registrada.</li>
                                <li>Al establecer una jerarquia intermedia entre los miembros del hogar, se sumara 1 a los miembros con jerarquia mas baja a la establecida.</li>
                            </ul>
                        </Alert>

                        <h5><strong>Dirección:</strong></h5>
                        <p>{hogar.hd_Calle} #{hogar.hd_Numero_Exterior}, {hogar.hd_Localidad}, {hogar.hd_Municipio_Ciudad}, {hogar.est_Nombre}, {hogar.pais_Nombre_Corto}</p>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>
                                        Miembros del hogar
                                    </th>
                                    <th>
                                        Jerarquia
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {miembrosHogar.map(miembro => (
                                    <tr>
                                        <td>{miembro.per_Nombre + ' ' + miembro.per_Apellido_Paterno + ' ' + miembro.per_Apellido_Materno}</td>
                                        <td>{miembro.hp_Jerarquia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <hr></hr>
                        <FormGroup row>
                            <Label for='Jerarquia' sm={3}>
                                <h5>Jerarquia por asignar: </h5>
                            </Label>
                            <Col sm={9}>
                                <Input
                                id='Jerarquia'
                                name='jerarquia'
                                type='select'
                                onChange={(e) => handleJerarquia( e.target.value )}
                               >
                                <option value="0" selected disabled >Selecionar jerarquia</option>
                                {miembrosHogar.map((miembro, index) => (
                                    <option key={miembro.hd_Id_Hogar} value={index + 1}>{index + 1}</option>
                                ))}
                                <option value={miembrosHogar.length + 1} >{miembrosHogar.length + 1}</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Form>
                    :
                    <Form>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Calle
                                    </Label>
                                    <Input id='calle' name='calle' placeholder='Nombre de la calle' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Exterior
                                    </Label>
                                    <Input id='extNumber' name='extNumber' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Numero Interior
                                    </Label>
                                    <Input id='intNumber' name='intNumber' placeholder='0000' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Tipo subdivisión
                                    </Label>
                                    <Input id='subDivType' name='subDivType' placeholder='Tipo subdivisión' type='select'>
                                        <option value="COL">COLONIA</option>
                                        <option value="FRACC">FRACC</option>
                                        <option value="EJ">EJIDO</option>
                                        <option value="SUBDIV">SUBDIV</option>
                                        <option value="BRGY">BRGY</option>
                                        <option value="RANCHO">RANCHO</option>
                                        <option value="MANZANA">MANZANA</option>
                                        <option value="RESIDENCIAL">RESIDENCIAL</option>
                                        <option value="SECTOR">SECTOR</option>
                                        <option value="SECCIÓN">SECCIÓN</option>
                                        <option value="UNIDAD">UNIDAD</option>
                                        <option value="BARRIO">BARRIO</option>
                                        <option value="ZONA">ZONA</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Subdivisión
                                    </Label>
                                    <Input id='subDiv' name='subDiv' placeholder='Subdivisión' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Localidad
                                    </Label>
                                    <Input id='localidad' name='localidad' placeholder='Localidad' type='text'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Municipio / Ciudad
                                    </Label>
                                    <Input id='municipioCiudad' name='municipioCiudad' placeholder='Nombre de Municipio / Ciudad' type='text'></Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        País
                                    </Label>
                                    <Input id='pais' name='pais' placeholder='Selecciona un país' type='select' onChange={(e) => handlePais( e.target.value )}>
                                        <option value="0" selected disabled >Selecciona un país</option>
                                        {paises.map(pais => (
                                            <option key={pais.pais_Id_Pais} value={pais.pais_Id_Pais}>{pais.pais_Nombre}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Estado
                                    </Label>
                                    <Input id='estado' name='estado' placeholder='Selecciona un estado' type='select' onChange={(e) => handleEstado( e.target.value )}>
                                        <option value="0" selected disabled >Selecciona un estado</option>
                                        {estados.map(estado => (
                                            <option key={estado.est_Id_Estado} value={estado.est_Id_Estado}>{estado.est_Nombre}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={4}>
                                <FormGroup>
                                    <Label>
                                        Telefono
                                    </Label>
                                    <Input id='tel' name='tel' placeholder='555 555 5555' type='tel'></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>}
                    <Row className="text-center">
                        <Col>
                            <Button color="danger" size='lg'>
                                Cancelar
                            </Button>
                        </Col>
                        <Col>
                            <Button color="primary" size='lg' onClick={e => postData()}>
                                <span className='fas fa-save'></span> Guardar
                            </Button>
                        </Col>
                    </Row>
                </Card>}
            </Container>
        </Layout>

    );
}

export default AltaRestitucion
// export default class AltaRestitucion extends Component {
//     url = helpers.url_api;

//     componentDidMount(){
//         this.getPersonas()
//         this.setState({
//             hogar: {
//                 ...this.state.hogar,
//                 hd_Id_Hogar: "0",
//                 hp_Jerarquia: "1"
//             }
//         })
//     }

//     getPersonas(){
//         helpers.authAxios.get("http://iece-tpr.ddns.net/webapi/api/Persona/GetPersonaRestitucion/227/true")
//             .then(res => {
//                 this.setState({
//                     personasPorRestituir: res.data.personas
//                 });
//                 console.log(this.state.personasPorRestituir)
//             });
//     }

//     fnEditaPersona = async (datos) => {
//         console.log(datos);
//         try {
//             await helpers.authAxios.put("http://iece-tpr.ddns.net/webapi/api/persona/" + datos.per_Id_Persona, datos)
//                 .then(res => {
//                     if (res.data.status === "success") {
//                         // alert(res.data.mensaje);
//                         setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
//                         this.setState({
//                             mensajeDelProceso: "Procesando...",
//                             modalShow: true
//                         });
//                         setTimeout(() => {
//                             this.setState({
//                                 mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
//                             });
//                         }, 1500);
//                         setTimeout(() => {
//                             document.location.href = '/ListaDePersonal'
//                         }, 3500);
//                     } else {
//                         // alert(res.data.mensaje);
//                         this.setState({
//                             mensajeDelProceso: "Procesando...",
//                             modalShow: true
//                         });
//                         setTimeout(() => {
//                             this.setState({
//                                 mensajeDelProceso: res.data.mensaje,
//                                 modalShow: false
//                             });
//                         }, 1500);
//                     }
//                 });
//         } catch (error) {
//             alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
//             // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
//         }
//     }

//     fnGuardaPersonaEnHogar = async (datos, jerarquia, hdId) => {
//         try {
//             await helpers.authAxios.post(this.url + "/persona/AddPersonaHogar/" + jerarquia + "/" + hdId, datos)
//                 .then(res => {
//                     if (res.data.status === "success") {
//                         this.setState({
//                             mensajeDelProceso: "Procesando...",
//                             modalShow: true
//                         });
//                         setTimeout(() => {
//                             this.setState({
//                                 mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
//                             });
//                         }, 1500);
//                         setTimeout(() => {
//                             document.location.href = '/ListaDePersonal'
//                         }, 3500);
//                     } else {
//                         alert("Error: No se pudo guardar. Revise los datos ingresados");
//                     }
//                 })
//         } catch (error) {
//             alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
//             setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
//         }
//     }


//     const_regex = {
//         alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
//         formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/,
//         formatoEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//         formatoTelefono: /^(\+\d{1,3})*(\(\d{2,3}\))*\d{7,25}$/
//     }
//     constructor(props) {
//         super(props)
//         this.state = {
//             nombre: null,
//             categoria: null,
//             domicilio: {},
//             fecha: null,
//             isValidName: false,
//             isValidDate: false,
//             mostrarHogar: false,
//             personasPorRestituir: [],
//             profesiones_oficios: [],
//             infante: false,
//             DatosHogar: {},
//             MiembroEsBautizado: false,
//             PromesaDelEspitiruSanto: false,
//             CasadoDivorciadoViudo: false,
//             ConcubinatoSolteroConHijos: false,
//             soltero: false,
//             datosPersonaEncontrada: {},
//             RFCSinHomoclave: "",
//             distritoSeleccionado: "0",
//             sectores: [],
//             per_Apellido_Materno_OK: false,
//             hogar: {},
//             redirect: false,
//             showModalAltaPersona: false,
//             emailInvalido: false,
//             fechaBautismoInvalida: false,
//             fechaBodaCivilInvalida: false,
//             fechaEspitiruSantoInvalida: false,
//             fechaBodaEclesiasticaInvalida: false,
//             telMovilInvalido: false,
//             mensajes: {},
//             DatosHogarDomicilio: [],
//             MiembrosDelHogar: [],
//             JerarquiasDisponibles: [],
//         };
//         this.handleDate = this.handleDate.bind(this);
//         this.handleName = this.handleName.bind(this);
//         this.handleMostrarHogar = this.handleMostrarHogar.bind(this);
//         this.handle_hd_Id_Hogar = this.handle_hd_Id_Hogar.bind(this);
//         this.handle_hp_Jerarquia = this.handle_hp_Jerarquia.bind(this);
//         this.updateInfo = this.updateInfo.bind(this);

//         if (!localStorage.getItem("token")) {
//             document.location.href = '/';
//         }
//     }

//     handleDate(event){
//         this.setState({isValidDate: this.const_regex.formatoFecha.test(event.target.value) })
//     }
//     handleName(event){
//         const id = event.target.value
//         helpers.authAxios.get("http://iece-tpr.ddns.net/webapi/api/Persona/" + id)
//             .then(res => {
//                 this.setState({
//                     datosPersonaEncontrada: res.data
//                 });
//             }).then(() => {
//                 this.setState({
//                     isValidName: id != null ? true : false,
//                     datosPersonaEncontrada:{
//                         ...this.state.datosPersonaEncontrada,
//                         per_Activo: true,
//                         per_En_Comunion: true
//                     }
//                 })
//             })
//     }
//     handleMostrarHogar(){
//         if(this.state.isValidDate && this.state.isValidName){
//             this.setState({mostrarHogar: true})
//         }else{
//             alert("Debes capturar correctamente los campos requeridos.")
//         }
//     }

//     /// METODOS PARA HOGAR - DOMICILIO ///
//     fnGetDatosDelHogar = async (id) => {
//         if (id !== "0") {
//             await helpers.authAxios.get(this.url + "/Hogar_Persona/GetMiembros/" + id)
//                 .then(res => {
//                     this.setState({ MiembrosDelHogar: res.data })
//                     console.log(res.data)
//                 })
//             await helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + id)
//                 .then(res => {
//                     this.setState({ DatosHogarDomicilio: res.data })
//                 })

//             let jerarquias = [];
//             for (let i = 1; i <= this.state.MiembrosDelHogar.length + 1; i++) {
//                 jerarquias.push(<option value={i}>{i}</option>)
//             }

//             await this.setState({ JerarquiasDisponibles: jerarquias })
//         } else {
//             this.setState({
//                 MiembrosDelHogar: [],
//                 DatosHogarDomicilio: [],
//                 JerarquiasDisponibles: []
//             })
//         }
//     }

//     handle_hd_Id_Hogar = async (e) => {
//         let idHogar = e.target.value;
//         console.log(idHogar)
//         this.setState({
//             hogar: {
//                 ...this.state.hogar,
//                 hd_Id_Hogar: idHogar,
//                 hp_Jerarquia: "1"
//             }
//         })
//         this.fnGetDatosDelHogar(idHogar);
//     }

//     handle_hp_Jerarquia = (e) => {
//         this.setState({
//             hogar: {
//                 ...this.state.hogar,
//                 hp_Jerarquia: e.target.value
//             }
//         })
//     }
//     updateInfo(){
//         this.fnEditaPersona(this.state.datosPersonaEncontrada)
//     }
//   render() {
//     const {
//         onChangeDomicilio,
//     } = this.props
//     return(
//         <Layout>
//         <Container>
//           {/* Datos generales */}
//           <div className="row mx-auto mt-3">
//               <div className="col-sm-12">
//                   <div className="card border-info acceso-directo">
//                       <div className="card-header">
//                           <h5><strong>Alta por Restitución</strong></h5>
//                       </div>
//                       <div className="card-body">
//                       <FormGroup>
//                         <div className="row">
//                         <div className="col-sm-2">
//                             <label><strong>*</strong> Persona</label>
//                         </div>
//                             <div className="col-sm-6">
//                                 <Input
//                                     type="select"
//                                     name="nombre"
//                                     className="form-control"
//                                     onChange={this.handleName}
//                                     defaultValue="0"
//                                 >
//                                 <option value="0" disabled>Selecionar persona</option>
//                                 {this.state.personasPorRestituir.map( item => (
//                                     <option key={item.per_Id_Persona} value={item.per_Id_Persona}>{item.per_Nombre + ' ' + item.per_Apellido_Paterno + ' ' + item.per_Apellido_Materno}</option>
//                                 ))}
//                                 </Input>
//                             </div>
//                         </div>
//                       </FormGroup>
//                       <FormGroup>
//                           <div className="row">
//                           <div className="col-sm-2">
//                                 <label><strong>*</strong> Categoria</label>
//                             </div>
//                               <div className="col-sm-4">
//                                     <Input
//                                         type="select"
//                                         name="per_category"
//                                         className="form-control"
//                                         value={this.state.per_category}
//                                     >   
//                                         <option value="AA" disabled >Selecionar categoria</option>
//                                         <option value="ADULTO_HOMBRE">Adulto Hombre</option>
//                                         <option value="ADULTO_MUJER">Adulto Mujer</option>
//                                         <option value="JOVEN_HOMBRE">Joven hombre</option>
//                                         <option value="JOVEN_MUJER">Joven mujer</option>
//                                     </Input>
//                               </div>
//                           </div>
//                       </FormGroup>
//                       <FormGroup>
//                         <div className="row">
//                         <div className="col-sm-2">
//                             <label><strong></strong> Comentario</label>
//                         </div>
//                             <div className="col-sm-4">
//                                 <Input
//                                     type="text"
//                                     name="commeent"
//                                     className="form-control"
//                                     value={this.state.comment}
//                                 />
//                             </div>
//                         </div>
//                       </FormGroup>
//                           <FormGroup>
//                             <div className="row">
//                             <div className="col-sm-2">
//                                     <label><strong>*</strong> Fecha de transaccion</label>
//                                 </div>
//                                 <div className="col-sm-4">
//                                         <Input
//                                             type="text"
//                                             name="per_Fecha_Transaccion"
//                                             className="form-control"
//                                             onChange={this.handleDate}
//                                             value={this.state.fecha}
//                                             placeholder="DD/MM/AAAA"
//                                         />
//                                 </div>
//                                 {!this.state.isValidDate &&
//                                     <span className="text-danger">
//                                         Campo requerido, el formato de fecha debe ser DD/MM/AAAA.
//                                     </span>
//                                 }
//                             </div>
//                           </FormGroup>
//                           <div className='row'>
//                             <div className="col-sm-2">
//                                 <Button
//                                     type="button"
//                                     color="danger"
//                                 >
//                                     <i>Cancelar</i>
//                                 </Button>
//                             </div>
//                             <div className="col-sm-2">
//                                 <Button
//                                     type="button"
//                                     color="primary"
//                                     onClick={this.handleMostrarHogar}
//                                 >
//                                     <i>Continuar</i>
//                                 </Button>
//                             </div>
//                           </div>
//                       </div>
//                   </div>
//               </div>
//           </div>

//           {this.state.mostrarHogar &&
//             <div className="row mx-auto mt-3">
//                 <div className="col-sm-12">
//                     <div className="card border-info acceso-directo">
//                         <div className="card-header">
//                             <h5><strong>Hogar / Domicilio</strong></h5>
//                         </div>
//                         <div className="card-body">
//                             <HogarPersonaDomicilio
//                                 domicilio={this.state.domicilio}
//                                 onChangeDomicilio={onChangeDomicilio}
//                                 handle_hd_Id_Hogar={this.handle_hd_Id_Hogar}
//                                 handle_hp_Jerarquia={this.handle_hp_Jerarquia}
//                                 hogar={this.state.hogar}
//                                 DatosHogarDomicilio={this.state.DatosHogarDomicilio}
//                                 MiembrosDelHogar={this.state.MiembrosDelHogar}
//                                 JerarquiasDisponibles={this.state.JerarquiasDisponibles}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//           }
//           <FormGroup>
//                 <div className="row mt-3">
//                     <div className="col-sm-2 offset-sm-2">
//                         <Link
//                             to="/ListaDePersonal"
//                             className="btn btn-success form-control"
//                         >
//                             <span className="fa fa-backspace" style={{ paddingRight: "10px" }}></span>
//                             Volver
//                         </Link>
//                     </div>
//                     <div className="col-sm-2 offset-sm-2">
//                         <Button
//                             onClick={this.updateInfo}
//                             className="btn btn-primary form-control"
//                         >
//                             <span className="fa fa-save" style={{ paddingRight: "10px" }}></span>
//                             Guardar
//                         </Button>
//                     </div>
//                 </div>
//             </FormGroup>
//         </Container>
//     </Layout>

//     );
//   }
// }
