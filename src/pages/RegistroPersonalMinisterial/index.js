import React, { Component } from 'react';
import helpers from "../../components/Helpers";
import {
    Container, Button, Input, Modal, ModalBody, Alert,
    CardTitle, Card, CardBody, Table, Row, Col, FormFeedback, FormGroup, ModalHeader, ModalFooter, CardFooter
} from 'reactstrap';
import logo from '../../assets/images/IECE_LogoOficial.jpg';
import '../../assets/css/index.css';
import 'moment/dist/locale/es';
import './style.css';

let dto = (JSON.parse(localStorage.getItem("dto")))
let sector = JSON.parse(localStorage.getItem("sector"))

class RegistroPersonalMinisterial extends Component {
    constructor(props) {
        super(props);


        this.state = {
            form: {},
            modal_Procesando: false,
            modal_Confirmacion: false,
            varonesSector: [],
            personalMinisterial: [],
            tipoRegistro: "NuevoElemento",
            submitBtnDisable: false,
        }
    }

    componentDidMount() {

        this.setState({
            form: {
                ...this.state.form,
                id_Persona: "0",
                id_Ministro: "0",
                nombre_Persona: "",
                nombre_Elemento: "",
                sec_Id_Sector: localStorage.getItem("sector"),
                usu_Id_Usuario: JSON.parse(localStorage.getItem('infoSesion')).pem_Id_Ministro,
                fechaTransaccion: ""
            }
        })

        //Sube el cursor hasta la parte superior
        window.scrollTo(0, 0);

        //Para sesión de Obispo
        if (sector == null) {


        } else { //Para sesión de Pastor
            helpers.authAxios.get("/PersonalMinisterial/GetPersonaCuyoIdPersonaNoEstaEnPersonalMinisterialBySector/" + sector)
                .then(res => {
                    console.log("varones: ", res.data.personas)
                    this.setState({ varonesSector: res.data.personas })
                });

            helpers.authAxios.get("/PersonalMinisterial/GetPersonalMinisterialSinIdMiembroByDistrito/" + dto)
                .then(res => {
                    this.setState({ personalMinisterial: res.data.personalSinVincularConPersona })

                });
        }
    }

    showModal = () => {
        this.setState({ modal: !this.state.modal })
    }



    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })

        if (e.target.name == "id_Persona" && e.target.value != "0") {

            let persona = this.state.varonesSector.filter((person) => person.per_Id_Persona == e.target.value);
            console.log("lista", persona)
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    nombre_Persona: persona[0].per_Nombre + " " + persona[0].per_Apellido_Paterno + " " + persona[0].per_Apellido_Materno

                }
            })
        }

        if (e.target.name == "id_Ministro" && e.target.value != "0") {

            let ministro = this.state.personalMinisterial.filter((person) => person.pem_Id_Ministro == e.target.value);
            console.log("lista", ministro)
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    nombre_Elemento: ministro[0].pem_Nombre,
                    tipoRegistro: "ElementoExistente"
                }
            })
        } else if (e.target.name == "id_Ministro" && e.target.value == "0") {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value,
                    tipoRegistro: "ElementoExistente"
                }
            })
        }
    }

    quitarAcentos(cadena) {
        return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    existeMinistro(persona) {
        return this.state.personalMinisterial.some(elemento =>
            this.quitarAcentos(elemento.pem_Nombre) === persona)
    }

    enviar1 = () => {
        if (this.state.form.id_Persona === "0") {
            alert("Error!. Debe seleccionar primero a Persona que desea vincular o registrar como elemento del Personal Ministerial")
            return false;
        }
        if (this.state.form.fechaTransaccion === "") {
            alert("Error!. Debe seleccionar la fecha del Alta del Elemento del Personal Ministerial")
            return false;
        }


        if (this.state.form.id_Ministro === "0") {//Si No eligió ningun elemento ya registrado en Personal Ministerial y desea Registrarlo como Nuevo.
            if (this.existeMinistro(this.state.form.nombre_Persona) === true) {
                alert("Notificación: Esta persona ya aparece como parte del Personal Ministerial, búsquelo en la caja de selección del Personal Ministerial del Distrito.")
                return false;
            }

            this.setState({
                modal_Confirmacion: true,
                tipoRegistro: "NuevoElemento"
            })
        } else {//Si eligió algun elemento que ya está registrado en Personal Ministerial y solo desea vincularlo.
            this.setState({
                modal_Confirmacion: true,
                tipoRegistro: "ElementoExistente"
            })
        }


    }

    closemodal_Confirmacion = () => {
        this.setState({ modal_Confirmacion: false })
    }

    handleContinue = async () => {


        // Cierra el Modal de COnfirmación y continua
        this.closemodal_Confirmacion();
        //Desabilita el Botón para evitar multiple ejecución por Clicks repetidos
        this.ChangeSubmitBtnDisable(true)

        this.setState({
            mensajeDelProceso: "Procesando...",
            modal_Procesando: true
        });
        //Procede a vincular o incorporar a la persona como parte del Personal Ministerial
        helpers.validaToken().then(helpers.authAxios.post(`${helpers.url_api}/PersonalMinisterial/AddPersonalMinisterial`, this.state.form)
            .then(res => {
                if (res.data.status === "success") {
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                        });
                    }, 1000);
                    setTimeout(() => {
                        document.location.href = '/ListaDePersonal'
                    }, 2000);
                }
                else {
                    this.setState({
                        mensajeDelProceso: "Procesando...",
                        modal_Procesando: true
                    });
                    setTimeout(() => {
                        this.setState({
                            mensajeDelProceso: res.data.mensaje,
                            modal_Procesando: false
                        });
                    }, 1500);
                    alert(`Error: \n${res.data.mensaje}`);
                }
            })
        );
    };

    ChangeSubmitBtnDisable = (bol) => {//Sirve para evitar multiples registros por dobleclick en botón Submit
        this.setState({ submitBtnDisable: bol });
    }

    render() {
        console.log("form:", this.state.form)
        return (
            <>
                <Container fluid>
                    {/* TABLA */}
                    <Card className="card" id="pdf">
                        <CardTitle className="text-center card-header text-gray-900" tag="h3">
                            <Row className="text-center text-gray-900">

                                <Col>
                                    ALTA DEL PERSONAL MINISTERIAL
                                </Col>
                            </Row>
                        </CardTitle>
                        <Alert color="warning" className="alertLogin">
                            <strong>Para incorporar un Elemento como parte del Personal Ministerial: </strong> <br />
                            <ol>
                                <li>Seleccione la persona que aparezca en la Lista de Personal Ministerial.
                                    <ul>
                                        <li>La primer caja de Selección contiene a los Varones del Sector.</li>
                                    </ul>
                                </li>
                                <li>Dado que es posible que la persona ya esté registrado en la Base de Datos de la Dirección General como Personal Ministerial,
                                    solo hace falta vincularlo. Búsquelo en la segunda caja de selección, la cual muestra los elementos ya registrados como parte del Personal Ministerial del Distrito.
                                    <ul>
                                        <li>Si la persona que desea dar de Alta ya se encuentra registrada, elija al Elemento del Personal Ministerial.</li>
                                        <li>Si la persona que desea dar de Alta No se encuentra registrada, elija la Opción "NUEVO ELEMENTO". Sólo se puede registrar "AUXILIARES".</li>
                                    </ul>
                                </li>
                            </ol>
                        </Alert>
                        <CardBody>
                            <>
                                <Row className=' mb-3'>
                                    <div className="col col-md-2"></div>
                                    <div className="col col-md-4">
                                        <label><h6>Seleccione la persona a Incorporar a la lista del Personal Ministerial</h6></label>
                                    </div>
                                    <div className="col col-md-4">
                                        <Input
                                            type="select"
                                            name="id_Persona"
                                            onChange={this.onChange}
                                            className="form-control "
                                            value={this.state.form.id_Persona}
                                        >
                                            <option value="0">SELECCIONE LA PERSONA</option>
                                            {this.state.varonesSector.map((persona) => {
                                                return <React.Fragment key={persona.per_Id_Persona}>
                                                    <option value={persona.per_Id_Persona}> {persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno}</option>
                                                </React.Fragment>
                                            }
                                            )}
                                        </Input>
                                    </div>
                                    <div className="col col-md-2"></div>
                                </Row>

                                <Row className='mb-2'>
                                    <div className="col col-md-2"></div>
                                    <div className="col col-md-4">
                                        <label ><h6>Elija el Elemento del Personal Ministerial que desea se reconozca como parte del Personal Ministerial. Si no se encuentra en la lista, elija "NUEVO ELEMENTO"</h6></label>
                                    </div>
                                    <div className="col col-md-4">
                                        <Input type="select"
                                            name="id_Ministro"
                                            onChange={this.onChange}
                                            className="form-control "
                                            value={this.state.form.id_Ministro}
                                        >
                                            <option value="0">NUEVO ELEMENTO</option>
                                            {this.state.personalMinisterial.map((min) => {
                                                return <React.Fragment key={min.pem_Id_Ministro}>
                                                    <option value={min.pem_Id_Ministro}>
                                                        {min.pem_Nombre}
                                                    </option>
                                                </React.Fragment>
                                            }
                                            )}
                                        </Input>
                                    </div>
                                    <div className="col col-md-2"></div>
                                </Row>

                                <Row className='mb-3'>
                                    <div className="col col-md-2"></div>
                                    <Col xs="4">
                                        <h6>Fecha de transacción:</h6>
                                    </Col>
                                    <Col xs="4">
                                        <Input
                                            type="date"
                                            name="fechaTransaccion"
                                            placeholder='DD/MM/AAAA'
                                            onChange={this.onChange}
                                            value={this.state.form.fechaTransaccion}
                                        />
                                        <FormFeedback>Este campo es requerido</FormFeedback>
                                    </Col>
                                    <div className="col col-md-2"></div>
                                </Row>

                                <CardFooter className='mt-3'>
                                    <Col className="col-md-2"></Col>
                                    <Col className=" col-md-8 text-right">
                                        <Button className="btn-success ml-auto" onClick={this.enviar1} disabled={this.submitBtnDisable}>
                                            {(this.state.form.id_Ministro === "0") ? (<>Registrar</>) : (<>Vincular</>)}
                                        </Button>
                                    </Col>
                                    <Col className="col-md-2"></Col>
                                </CardFooter>
                            </>

                        </CardBody>
                    </Card>
                </Container>
                <Modal isOpen={this.state.modal_Confirmacion} className="card">
                    <ModalHeader className="card-header">
                        <h2>Confirmación</h2>
                    </ModalHeader>
                    <ModalBody className="card-body">
                        <div >
                            <div >
                                {this.state.tipoRegistro == "NuevoElemento" &&
                                    <p>¿Estas seguro de querer agregar a <strong> {this.state.form.nombre_Persona} </strong>como elemento del Personal Ministerial?</p>
                                }
                                {this.state.tipoRegistro == "ElementoExistente" &&
                                    <p>¿Estas seguro de Vincular a
                                        <strong> {this.state.form.nombre_Persona} </strong>
                                        con el Elemento del Personal Ministerial ya Existente en la Base de Datos de Secretaría General de nombre
                                        <strong> {this.state.form.nombre_Elemento} </strong>?
                                    </p>
                                }
                            </div>
                        </div>
                    </ModalBody>

                    <div className="modal-buttons">
                        <button className="btn btn-secondary m-3" onClick={this.closemodal_Confirmacion}>Cancelar</button>
                        <button className="btn btn-success m-3 " onClick={this.handleContinue} disabled={this.submitBtnDisable}>Continuar</button>
                    </div>

                </Modal>
                <Modal isOpen={this.state.modal_Procesando}>
                    <ModalBody>
                        Procesando...
                    </ModalBody>
                </Modal>
            </>
        )
    }
}
export default RegistroPersonalMinisterial;
