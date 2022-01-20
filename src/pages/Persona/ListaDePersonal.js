import React, { Component } from 'react';
import helpers from '../../components/Helpers';
import '../../assets/css/index.css';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, /* Input, */ Alert,
    Container, Row, Col,
    /* Form, FormGroup, Label */
} from 'reactstrap';
import Layout from '../Layout';
import IECELogo from '../../assets/images/IECE_logo.png'

class ListaDePersonal extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        this.state = {
            personas: [],
            status: null,
            sector: {},
            distrito: {},
            modalOpen: false,
            showModalPersonaGenerales: false,
            showModalPersonaFamiliaAsendente: false,
            showModalPersonaEclesiasticos: false,
            showModalPersonaEstadoCivil: false,
            showModalPersonaHogar: false,
            currentPersona: {},
            currentProfesion1: {},
            currentProfesion2: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
            modalInfoPersona: false,
            showModalEliminaPersona: false
        };
        if (!localStorage.getItem("token")) {
            document.location.href = '/';
        }
    }

    componentDidMount() {
        this.getPersonas();
        this.getSector();
    }

    getProfesion1 = async (persona) => {
        return await helpers.authAxios.get(this.url + "/persona/GetProfesion1/" + persona)
            .then(res => res.data)
            .catch(error => error);
    }
    getProfesion2 = async (persona) => {
        return await helpers.authAxios.get(this.url + "/persona/GetProfesion2/" + persona)
            .then(res => res.data)
            .catch(error => error);
        /* .then(res => {
            this.setState({
                currentProfesion2: res.data
            });
        }); */
    }

    getPersonas = () => {
        if (localStorage.getItem('sector') !== null) {
            helpers.authAxios.get(this.url + "/persona/GetBySector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        personas: res.data,
                        status: 'success'
                    });
                });
        }
        else {
            helpers.authAxios.get(this.url + "/persona/GetByDistrito/" + localStorage.getItem('dto'))
                .then(res => {
                    this.setState({
                        personas: res.data.personas,
                        status: 'success'
                    });
                });
        }
    };

    InfoAdicional = () => {
        return (
            alert("Disponible proximamente.")
        );
    }

    fnEliminaPersona = async (persona) => {
        await helpers.authAxios.delete(this.url + "/persona/" + persona.per_Id_Persona)
            .then(res => res.data)
            .catch(error => error);
        window.location.reload();
    }

    InfoStatus = (persona) => {
        let bautizado = persona.per_Bautizado === true ? "Bautizado" : "No bautizado";
        let activo = persona.per_Activo === true ? "Activo" : "No activo";
        let vivo = persona.per_Vivo === true ? "Vivo" : "Finado";

        let infoStatus = {
            bautizado,
            activo,
            vivo
        }
        return infoStatus;
    }

    getSector = async () => {
        if (localStorage.getItem('sector') !== null) {
            await helpers.authAxios.get(this.url + "/sector/" + localStorage.getItem('sector'))
                .then(res => {
                    this.setState({
                        sector: res.data.sector[0]
                    });
                });
        }
    }

    handle_modalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: true,
            currentPersona: info
        });
    }

    handle_closeModalEliminaPersona = (info) => {
        this.setState({
            showModalEliminaPersona: false,
            currentPersona: {}
        });
    }

    handle_modalInfoPersona = async (persona) => {
        persona.per_Fecha_BautismoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Bautismo);
        persona.per_Fecha_Boda_CivilFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Civil);
        persona.per_Fecha_Boda_EclesiasticaFormateada = helpers.reFormatoFecha(persona.per_Fecha_Boda_Eclesiastica);
        persona.per_Fecha_NacimientoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Nacimiento);
        persona.per_Fecha_Recibio_Espiritu_SantoFormateada = helpers.reFormatoFecha(persona.per_Fecha_Recibio_Espiritu_Santo);
        this.setState({
            modalInfoPersona: true,
            currentPersona: persona
        });

        let getHogar = await helpers.authAxios.get(this.url + "/Hogar_Persona/GetHogarByPersona/" + persona.per_Id_Persona)
            .then(res => res.data);
            
        await helpers.authAxios.get(this.url + "/Hogar_Persona/GetDatosHogarDomicilio/" + getHogar.hd_Id_Hogar)
            .then(res => {
                this.setState({
                    DatosHogarDomicilio: res.data[0]
                });
            });
    }

    handle_modalInfoPersonaClose = () => {
        this.setState({
            modalInfoPersona: false,
            currentPersona: {},
            MiembrosDelHogar: [],
            DatosHogarDomicilio: {},
            CasadoDivorciadoViudo: false,
            ConcubinadoSolteroConHijos: false,
            soltero: false,
        });
    }

    handle_editarPersona = (infoPersona) => {
        if (localStorage.getItem("idPersona")) {
            localStorage.removeItem("idPersona");
            localStorage.removeItem("currentPersona");
        }
        localStorage.setItem("idPersona", infoPersona.per_Id_Persona);
        localStorage.setItem("currentPersona", JSON.stringify(infoPersona));
        document.location.href = "/RegistroDePersona";
    }

    render() {
        if (this.state.personas.length >= 1) {
            return (
                <Layout>
                    <React.Fragment>
                        {/* <h1 className="text-info">Listado de personal</h1> */}
                        <div className="row">
                            <div className="col-9">
                                
                                {localStorage.getItem('sector') !== null &&
                                    <p>
                                        Personal del {this.state.sector.dis_Tipo_Distrito} {this.state.sector.dis_Numero} ({this.state.sector.dis_Alias}, {this.state.sector.dis_Area}) <br />
                                        {this.state.sector.sec_Tipo_Sector} {this.state.sector.sec_Numero}: {this.state.sector.sec_Alias}
                                    </p>
                                }
                                {localStorage.getItem('sector') === null &&
                                    <p> Personal de TODOS los SECOTRES del DISTRITO. </p>
                                }
                            </div>
                            <div className="col-2">
                                {/* <Link to="/RegistroDePersona" className="btn bnt-sm btn-primary">Registrar persona</Link> */}
                                {/* <button onClick={helpers.handle_RegistroNvaPersona} className="btn bnt-sm btn-primary">Registrar persona</button> */}
                            </div>
                        </div>
                        <br />
                        <table className="table" id="tblPersonas">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col" className="text-center">Grupo</th>
                                    <th scope="col" className="text-center">Categoria</th>
                                    <th scope="col" className="text-center">Activo</th>
                                    {/* <th scope="col" className="text-center">Vivo</th> */}
                                    <th scope="col" className="text-center">Sector</th>
                                    <th scope="col" className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.personas.map((persona) => {
                                        return (
                                            <React.Fragment key={persona.per_Id_Persona}>
                                                <tr>
                                                    <td>{persona.per_Nombre} {persona.per_Apellido_Paterno} {persona.per_Apellido_Materno} </td>
                                                    <td className="text-center">
                                                        {this.InfoStatus(persona).bautizado}
                                                    </td>
                                                    <td className="text-center">
                                                        {persona.per_Categoria}
                                                    </td>
                                                    <td className="text-center">
                                                        {this.InfoStatus(persona).activo}
                                                    </td>
                                                    <td className="text-center">
                                                        {persona.sec_Numero}
                                                    </td>
                                                    {/* <td className="text-center">
                                                        {this.InfoStatus(persona).vivo}
                                                    </td> */}
                                                    {/* <td className="text-center">
                                                <button onClick={() => this.openModalPersonaGenerales(persona)} className="bordeRedondo">
                                                    <span className="fas fa-info-circle fa-lg" title="Info general"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaFamiliaAsendente(persona)} className="bordeRedondo">
                                                    <span className="fas fa-users fa-lg" title="Familia asendente"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEstadoCivil(persona)} className="bordeRedondo">
                                                    <span className="fas fa-baby-carriage fa-lg" title="Estado civil"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaEclesiasticos(persona)} className="bordeRedondo">
                                                    <span className="fas fa-user-check fa-lg" title="Ecelsiasticos"></span>
                                                </button>
                                                <button onClick={() => this.openModalPersonaHogar(persona)} className="bordeRedondo">
                                                    <span className="fas fa-home fa-lg" title="Hogar"></span>
                                                </button>
                                            </td> */}
                                                    <td className="text-center">
                                                        <button
                                                            // onClick={this.handle_modalInfoPersona}
                                                            // onClick={() => this.handle_modalInfoPersona(persona)}
                                                            className="btn btn-success btn-sm btnMarginRight"
                                                            title="Analizar persona">
                                                            <span className="fas fa-eye icon-btn-p"></span>Analizar
                                                        </button>
                                                        <button
                                                            // onClick={this.handle_modalInfoPersona}
                                                            // onClick={() => this.handle_modalInfoPersona(persona)}
                                                            className="btn btn-info btn-sm btnMarginRight"
                                                            title="Hogar">
                                                            <span className="fas fa-home icon-btn-p"></span>Hogar
                                                        </button>
                                                        <button
                                                            // onClick={this.handle_modalInfoPersona}
                                                            onClick={() => this.handle_modalInfoPersona(persona)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Hoja de datos">
                                                            <span className="fas fa-clipboard icon-btn-p"></span>Hoja Datos
                                                        </button>
                                                        {/* <button
                                                            // onClick={() => this.fnEliminaPersona(persona)}
                                                            onClick={() => this.handle_modalEliminaPersona(persona)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Eliminar persona">
                                                            <span className="fas fa-trash-alt icon-btn-p"></span>Eliminar
                                                        </button> */}
                                                    </td>
                                                </tr>
                                                <Modal isOpen={this.state.modalInfoPersona} contentClassName="modalVerInfoPersona" size="lg">
                                                    <Container>
                                                        <div id="infoDatosEstadisticos">
                                                            <ModalHeader>
                                                                <Row>
                                                                    <Col sm="5">
                                                                        <img src={IECELogo} className="imgLogoModalDatosEstadisticos" alt="Logo" />
                                                                    </Col>
                                                                    <Col sm="7" className="tituloDatosEstadisticos">
                                                                        Hoja de Datos Estadísticos
                                                                    </Col>
                                                                </Row>
                                                            </ModalHeader>
                                                            <ModalBody>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >1.- Nombre: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >2.- Edad: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_NacimientoFormateada} </span>
                                                                    </Col>
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >Nacionalidad: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nacionalidad} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >3.- Lugar y fecha de nacimiento: </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >4.- Nombre de sus padres: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Padre}, {this.state.currentPersona.per_Nombre_Madre} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >5.- Abuelos paternos: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Paterno}, {this.state.currentPersona.per_Nombre_Abuela_Paterna} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >6.- Abuelos maternos: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Abuelo_Materno}, {this.state.currentPersona.per_Nombre_Abuela_Materna} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >7.- Estado civil: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Estado_Civil} </span>
                                                                    </Col>
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >Fecha de la boda civil: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_CivilFormateada} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >Según acta: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Num_Acta_Boda_Civil} </span>
                                                                    </Col>
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >Del Libro No.: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Libro_Acta_Boda_Civil} </span>
                                                                    </Col>
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >Que lleva la oficialía: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Oficialia_Boda_Civil} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >Del Registro Civil en: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Registro_Civil} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >8.- Contrajo Matrimonio Eclesiástico en la I.E.C.E el día: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Boda_EclesiasticaFormateada} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >Lugar de Matrimonio Eclesiástico en la I.E.C.E.: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Lugar_Boda_Eclesiastica} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >10.- Cuantos hijos y sus nombres: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cantidad_Hijos} </span>
                                                                    </Col>
                                                                    <Col sm="8">
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Nombre_Hijos} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >13.- Fecha en la que recibio la promesa del Espiritu Santo: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Fecha_Recibio_Espiritu_SantoFormateada} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >Bajo la imposición de manos del presbiterio: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Bajo_Imposicion_De_Manos} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >14.- Puestos desempeñados en la IECE: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cargos_Desempenados} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >15.- Cambios de domicilio: </span>
                                                                        <span className="infoDatosEstadisticos" >{this.state.currentPersona.per_Cambios_De_Domicilio} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="12">
                                                                        <span className="tituloListaDatosEstadisticos" >16.- Domicilio actual: </span>
                                                                        <span className="infoDatosEstadisticos" >
                                                                            Calle: {this.state.DatosHogarDomicilio.hd_Calle}, No.: {this.state.DatosHogarDomicilio.hd_Numero_Exterior}, Interior: {this.state.DatosHogarDomicilio.hd_Numero_Interior},
                                                                            Tipo subdivision: {this.state.DatosHogarDomicilio.hd_Tipo_Subdivision}, Subdivision: {this.state.DatosHogarDomicilio.hd_Subdivision} <br />
                                                                            Localidad: {this.state.DatosHogarDomicilio.hd_Localidad}, Municipio/cuidad: {this.state.DatosHogarDomicilio.hd_Municipio_Ciudad},
                                                                            {this.state.DatosHogarDomicilio.est_Nombre}, Pais: {this.state.DatosHogarDomicilio.pais_Nombre_Corto} <br />
                                                                            Telefono: {this.state.DatosHogarDomicilio.hd_Telefono}
                                                                        </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >17.- Teléfono: </span>
                                                                        <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Telefono_Movil} </span>
                                                                    </Col>
                                                                    <Col sm="4">
                                                                        <span className="tituloListaDatosEstadisticos" >E-mail: </span>
                                                                        <span className="infoDatosEstadisticos" > {this.state.currentPersona.per_Email_Personal} </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="modalBodyRowDatosEstadisticos">
                                                                    <Col sm="6">
                                                                        <span className="tituloListaDatosEstadisticos" >18.- Profesión / Oficio: </span>
                                                                        <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio1} </span>
                                                                    </Col>
                                                                    <Col sm="6">
                                                                        <span className="tituloListaDatosEstadisticos" >Profesión / Oficio: </span>
                                                                        <span className="infoDatosEstadisticos" > {this.state.currentPersona.pro_Id_Profesion_Oficio2} </span>
                                                                    </Col>
                                                                </Row>
                                                            </ModalBody>
                                                        </div>
                                                        <ModalFooter>
                                                            <Button color="secondary" onClick={this.handle_modalInfoPersonaClose}>Cancel</Button>
                                                            <Button
                                                                color="danger"
                                                                onClick={() => helpers.ToPDF("infoDatosEstadisticos")} >
                                                                <span className="fas fa-file-pdf icon-btn-p"></span>Generar PDF
                                                            </Button>
                                                            <Button
                                                                color="success"
                                                                onClick={() => this.handle_editarPersona(this.state.currentPersona)} >
                                                                <span className="fas fa-pencil-alt icon-btn-p"></span>Editar
                                                            </Button>
                                                        </ModalFooter>
                                                    </Container>
                                                </Modal>
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <Modal
                            isOpen={this.state.showModalEliminaPersona}
                            onRequestClose={this.handle_closeModalEliminaPersona}
                            size="lg"
                        >
                            <ModalHeader>
                                Eliminar persona.
                            </ModalHeader>
                            <ModalBody>
                                <Alert color="warning">
                                    <strong>Advertencia: </strong><br />
                                    Al eliminar una persona seran reorganizadas las jerarquias dentro del hogar y
                                    si la persona es la ultima del hogar, entonces, el hogar tambien sera eliminado.
                                </Alert>
                                ¿Esta seguro de querer eliminar a la persona: <strong>{this.state.currentPersona.per_Nombre} {this.state.currentPersona.per_Apellido_Paterno} {this.state.currentPersona.per_Apellido_Materno}</strong>?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="secondary" onClick={this.handle_closeModalEliminaPersona}>Cancelar</Button>
                                <Button color="danger" onClick={() => this.fnEliminaPersona(this.state.currentPersona)}>Eliminar</Button>
                            </ModalFooter>
                        </Modal>
                    </React.Fragment>
                </Layout>
            );
        } else if (this.state.personas.length === 0 && this.state.status === 'success') {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Aun no hay personas registras!</h3>
                        <p>Haga clic en el boton Registrar persona para registrar una persona.</p>
                    </React.Fragment>
                </Layout>
            );
        } else {
            return (
                <Layout>
                    <React.Fragment>
                        <h3>Cargando información...</h3>
                        <p>Por favor espere.</p>
                    </React.Fragment>
                </Layout>
            );
        }
    };
}

export default ListaDePersonal;