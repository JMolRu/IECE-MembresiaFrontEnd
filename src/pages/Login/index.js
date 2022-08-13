import React, { Component } from 'react';
import {
    Form, FormGroup, Input, Row, Col,
    Container, Card, CardBody, Alert, Button
} from 'reactstrap'
import './style.css'
import helpers from '../../components/Helpers'

class Login extends Component {

    url = helpers.url_api;
    infoSesion = JSON.parse(localStorage.getItem('infoSesion'));

    constructor(props) {
        super(props);
        this.state = {
            distritoSeleccionado: "0",
            listaDistritosPorMinistro: [],
            listaSectoresPorDistrito: [],
            listaSectoresPorMinistro: [],
            sectorSeleccionado: "0",
            obispo: false,
            idSector: 0
        }
    }

    componentDidMount() {
        this.getListaDistritosPorMinistro();
    }

    onChangeMinistro = (e) => {
        // console.log(e.target.value);
        if (e.target.value !== "0") {
            this.getListaDistritosPorMinistro(e.target.value);
            this.setState({
                ministroSeleccionado: e.target.value,
                distritoSeleccionado: "0",
                sectorSeleccionado: "0"
            });
        } else {
            this.setState({
                ministroSeleccionado: "0",
                distritoSeleccionado: "0",
                sectorSeleccionado: "0"
            })
        }
    }

    /* getListaDistritosPorMinistro = async () => {
        await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetAlcancePastoralByMinistro/' + this.infoSesion.mu_pem_Id_Pastor)
            .then(res => {
                if (res.data.obispo === true) {
                    this.setState({
                        obispo: true,
                        listaDistritosPorMinistro: res.data.datos
                    })
                } else {
                    this.setState({
                        obispo: false,
                        idSector: res.data.datos[0].sec_Id_Sector,
                        listaDistritosPorMinistro: res.data.datos[0]
                    })
                }
                // console.log(res.data.datos);
                // this.setState({ listaDistritosPorMinistro: res.data.datos });
            });
    } */

    /* getListaDistritosPorMinistro = async () => {
        await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetSectoresByMinistro/' + this.infoSesion.mu_pem_Id_Pastor)
            .then(res => {
                this.setState({
                    listaDistritosPorMinistro: res.data.sectores
                })
            });
    } */

    getListaDistritosPorMinistro = async () => {
        await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetDistritosByMinistro/' + this.infoSesion.mu_pem_Id_Pastor)
            .then(res => {
                this.setState({
                    listaDistritosPorMinistro: res.data.distritos
                })
            });
    }

    /* getListaSectoresPorMinistro = async (idDistrito, idMinistro) => {
        if (this.state.obispo) {
            await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetSectoresByDistritoMinistro/' + idDistrito + '/' + idMinistro)
                .then(res => {
                    this.setState({ listaSectoresPorMinistro: res.data.sectores });
                });
        }
        else {
            await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetSectoresByMinistro/' + idMinistro)
                .then(res => {
                    this.setState({ listaSectoresPorMinistro: res.data.sectores });
                });
        }
    } */

    /* getListaSectoresPorDistrito = async (idDistritoSector, obispo) => {
        if (obispo) {
            await helpers.authAxios.get(this.url + '/Sector/GetSectoresByDistrito/' + idDistritoSector)
                .then(res => {
                    this.setState({ listaSectoresPorDistrito: res.data.sectores });
                });
        }
        else {
            await helpers.authAxios.get(this.url + '/Sector/' + idDistritoSector)
                .then(res => {
                    this.setState({ listaSectoresPorDistrito: res.data.sector });
                });
        }

    } */

    getListaSectoresPorDistritoMinistro = async (idDistrito, idMinistro) => {
        await helpers.authAxios.get(this.url + '/PersonalMinisterial/GetSectoresByDistritoMinistro/' + idDistrito + '/' + idMinistro)
        .then(res => {
            this.setState({ 
                listaSectoresPorDistrito: res.data.sectores,
                obispo: res.data.obispo
            });
        })
    }

    onChangeDistrito = (e) => {
        this.setState({ distritoSeleccionado: e.target.value });
        this.setState({ sectorSeleccionado: "0" });
        localStorage.removeItem('sector');

        // Almacenar Distrito en LocalStorage
        localStorage.setItem('dto', e.target.value)
        if (e.target.value === "0") {
            this.setState({ 
                listaSectoresPorDistrito: [],
                obispo: false
            })
            return false
        }
        else {
            this.getListaSectoresPorDistritoMinistro(e.target.value, this.infoSesion.mu_pem_Id_Pastor);
        }
        /* this.state.listaDistritosPorMinistro.forEach(distrito => {
            if (distrito.dis_Id_Distrito === parseInt(e.target.value)) {
                if (distrito.pem_Id_Obispo === this.infoSesion.mu_pem_Id_Pastor) {
                    this.setState({ obispo: true })
                    this.getListaSectoresPorDistrito(e.target.value, true)
                }
                else {
                    this.setState({ obispo: false })
                    this.getListaSectoresPorDistrito(distrito.sec_Id_Sector, false)
                }
            }
        }); */
    }

    onChangeSector = (e) => {
        this.setState({ sectorSeleccionado: e.target.value });
        if (e.target.value !== "0") {
            // Almacenar Sector en LocalStorage
            localStorage.setItem('sector', e.target.value)
        }
        else {
            localStorage.removeItem('sector')
        }
    }

    handleLogoff = () => {
        localStorage.clear();
        document.location.href = '/';
    }

    iniciarSesion = (e) => {
        e.preventDefault();
        if (this.state.distritoSeleccionado === "0") {
            alert("Error: Debe seleccionar un distrito para continuar.");
            return false;
        }
        if (!this.state.obispo && this.state.sectorSeleccionado !== "0") {
            localStorage.setItem('sector', this.state.sectorSeleccionado)
            document.location.href = '/Main';
        }

        if (this.state.obispo && this.state.sectorSeleccionado === "0") {
            document.location.href = '/Main';
        }
        if (!this.state.obispo && this.state.sectorSeleccionado === "0") {
            alert("Error: Debe seleccionar un sector para continuar.");
            return false;
        }
        if (this.state.sectorSeleccionado !== "0") {
            localStorage.setItem('sector', this.state.sectorSeleccionado)
            document.location.href = '/Main';
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col sm="12">
                        <Card className="margen">
                            <CardBody>
                                <Form onSubmit={this.iniciarSesion}>
                                    {/* {this.state.listaDistritosPorMinistro.length > 0 && */}
                                    <React.Fragment>
                                        <Alert color="warning" className="alertLogin">
                                            <strong>Aviso: </strong> <br />
                                            <ul>
                                                <li>Si el usuario (ministro) es <strong>obispo</strong>:
                                                    <ul>
                                                        <li>Podra iniciar sesión seleccionando tan solo el distrito: en cuyo caso vera la información que correspone a los sectores del distrito.</li>
                                                        <li>Si selecciona el sector ademas del distrito: vera solo la información que corresponde al sector.</li>
                                                    </ul>
                                                </li>
                                                <li>Si el usuario (ministro) es <strong>pastor</strong>: debera seleccionar distrito y sector para poder iniciar sesión.</li>
                                            </ul>
                                        </Alert>
                                        <FormGroup>
                                            <Row>
                                                <Col sm="2">
                                                    Distrito:
                                                </Col>
                                                <Col sm="10">
                                                    <React.Fragment>
                                                        <Input
                                                            type="select"
                                                            name="listaDistritos"
                                                            value={this.state.distritoSeleccionado}
                                                            onChange={this.onChangeDistrito}
                                                        >
                                                            <option value="0">Selecciona un distrito</option>
                                                            {
                                                                this.state.listaDistritosPorMinistro.map(distrito => {
                                                                    return (
                                                                        <React.Fragment key={distrito.dis_Id_Distrito}>
                                                                            <option value={distrito.dis_Id_Distrito}>{distrito.dis_Tipo_Distrito} {distrito.dis_Numero}: {distrito.dis_Alias}</option>
                                                                        </React.Fragment>
                                                                    )
                                                                })
                                                            }
                                                        </Input>
                                                    </React.Fragment>
                                                    {/* {this.state.obispo &&
                                                        
                                                    } */}
                                                    {/* {!this.state.obispo &&
                                                        <React.Fragment>
                                                            <Input
                                                                type="select"
                                                                name="listaDistritos"
                                                                value={this.state.distritoSeleccionado}
                                                                onChange={this.onChangeDistrito}
                                                            >
                                                                <option value="0">Selecciona un distrito</option>
                                                                <option value={this.state.listaDistritosPorMinistro.dis_Id_Distrito}>{this.state.listaDistritosPorMinistro.dis_Tipo_Distrito} {this.state.listaDistritosPorMinistro.dis_Numero}: {this.state.listaDistritosPorMinistro.dis_Alias}</option>
                                                            </Input>
                                                        </React.Fragment>
                                                    } */}
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    </React.Fragment>
                                    {/* } */}
                                    {this.state.distritoSeleccionado !== "0" &&
                                        <FormGroup>
                                            <Row>
                                                <Col sm="2">
                                                    Sector:
                                                </Col>
                                                <Col sm="10">
                                                    <Input
                                                        type="select"
                                                        name="listaSectores"
                                                        value={this.state.sectorSeleccionado}
                                                        onChange={this.onChangeSector}
                                                    >
                                                        <option value="0">Selecciona un sector</option>
                                                        {
                                                            this.state.listaSectoresPorDistrito.map(sector => {
                                                                return (
                                                                    <React.Fragment key={sector.sec_Id_Sector}>
                                                                        <option value={sector.sec_Id_Sector}>{sector.sec_Alias}</option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                        {/* {
                                                            this.state.listaSectoresPorMinistro.map(sector => {
                                                                return (
                                                                    <React.Fragment key={sector.sec_Id_Sector}>
                                                                        <option value={sector.sec_Id_Sector}>{sector.sec_Alias}</option>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        } */}
                                                    </Input>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                    }
                                    <FormGroup>
                                        <Row>
                                            <Col sm="8"></Col>
                                            <Col sm="4">
                                                <Button
                                                    type="button"
                                                    className="btnForm"
                                                    onClick={this.handleLogoff}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                >
                                                    <span className="fa fa-user faIconButton"></span>
                                                    Iniciar sesión
                                                </Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Login;