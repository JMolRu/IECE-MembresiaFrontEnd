import React, { Component } from 'react';
import PersonaForm from './PersonaForm';
import axios from 'axios';
import helpers from '../../components/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../Layout';
import { Modal, ModalBody, /* ModalFooter, ModalHeader, Button */ } from 'reactstrap';

class RegistroDePersonal extends Component {

    url = helpers.url_api;

    constructor(props) {
        super(props);
        if (!localStorage.getItem('token')) {
            document.location.href = '/';
        }
        if (!localStorage.getItem("idPersona")) {
            localStorage.setItem("idPersona", "0");
            localStorage.setItem("nvaAltaBautizado", "false");
            localStorage.setItem("nvaAltaComunion", "false");
        }

        this.state = {
            form: {},
            domicilio: {},
            /* hogar: {}, */
            FrmValidaPersona: true,
            bolPersonaEncontrada: false,
            categoriaSeleccionada: false,
            msjCategoriaSeleccionada: "",
            habilitaPerBautizado: false,
            per_Nombre_NoValido: true,
            per_Apellido_Paterno_NoValido: true,
            per_Fecha_Nacimiento_NoValido: true,
            modalShow: false,
            mensajeDelProceso: "",
            tituloAgregarEditar: "Agregar nuevo miembro",
            boolAgregarNvaPersona: true,
            boolComentarioEdicion: false,
            ComentarioHistorialTransacciones: ""
        }
    }

    setFrmValidaPersona = (bol) => {
        this.setState({ FrmValidaPersona: bol })
    }

    setBolPersonaEncontrada = (bol) => {
        this.setState({ bolPersonaEncontrada: bol })
    }

    componentDidMount() {
        if (localStorage.getItem("idPersona") === "0") {
            this.setState({
                form: {
                    ...this.state.form,
                    per_Categoria: "0",
                    per_Bautizado: JSON.parse(localStorage.getItem("nvaAltaBautizado")),
                    per_RFC_Sin_Homo: "XAXX010101XXX",
                    per_Estado_Civil: "SOLTERO(A)",
                    per_foto: uuidv4(),
                    per_Activo: 1,
                    per_En_Comunion: JSON.parse(localStorage.getItem("nvaAltaComunion")),
                    per_Vivo: 1,
                    pro_Id_Profesion_Oficio1: "1",
                    pro_Id_Profesion_Oficio2: "1",
                    per_Nombre_Padre: "",
                    per_Nombre_Madre: "",
                    per_Nombre_Abuelo_Paterno: "",
                    per_Nombre_Abuela_Paterna: "",
                    per_Nombre_Abuelo_Materno: "",
                    per_Nombre_Abuela_Materna: "",
                    per_Fecha_Boda_Civil: "1900-01-01",
                    per_Fecha_Boda_Eclesiastica: "1900-01-01",
                    per_Num_Acta_Boda_Civil: "",
                    per_Oficialia_Boda_Civil: "",
                    per_Registro_Civil: "",
                    per_Nombre_Conyuge: "",
                    per_Libro_Acta_Boda_Civil: "",
                    per_Fecha_Bautismo: "1900-01-01",
                    per_Fecha_Recibio_Espiritu_Santo: "1900-01-01",
                    per_Cargos_Desempenados: "",
                    per_Cantidad_Hijos: "0",
                    per_Nombre_Hijos: "",
                    sec_Id_Sector: JSON.parse(localStorage.getItem('infoSesion')).sec_Id_Sector
                },
                domicilio: {
                    ...this.state.domicilio,
                    hd_Tipo_Subdivision: "COL",
                    sec_Id_Sector: JSON.parse(localStorage.getItem('infoSesion')).sec_Id_Sector,
                    dis_Id_Distrito: JSON.parse(localStorage.getItem('infoSesion')).dis_Id_Distrito
                },
                habilitaPerBautizado: true
                /* hogar: {
                    ...this.state.hogar,
                    hd_Id_Hogar: 0,
                    hp_Jerarquia: 1
                } */
            })
        } else {

            helpers.authAxios.get(this.url + "/Persona/" + localStorage.getItem("idPersona"))
                .then(res => {
                    res.data.per_Fecha_Nacimiento = helpers.reFormatoFecha(res.data.per_Fecha_Nacimiento);
                    res.data.per_Fecha_Bautismo = helpers.reFormatoFecha(res.data.per_Fecha_Bautismo);
                    res.data.per_Fecha_Boda_Civil = helpers.reFormatoFecha(res.data.per_Fecha_Boda_Civil);
                    res.data.per_Fecha_Boda_Eclesiastica = helpers.reFormatoFecha(res.data.per_Fecha_Boda_Eclesiastica);
                    res.data.per_Fecha_Recibio_Espiritu_Santo = helpers.reFormatoFecha(res.data.per_Fecha_Recibio_Espiritu_Santo);
                    this.setState({
                        form: res.data
                    })
                    localStorage.setItem('estadoCivil', res.data.per_Estado_Civil);
                })

            this.setState({
                categoriaSeleccionada: true,
                per_Nombre_NoValido: false,
                per_Apellido_Paterno_NoValido: false,
                per_Fecha_Nacimiento_NoValido: false,
                FrmValidaPersona: false,
                bolPersonaEncontrada: false,
                tituloAgregarEditar: "Editar información de la persona",
                boolAgregarNvaPersona: false,
                boolComentarioEdicion: true,
                form: {
                    ...this.state.form,
                    per_Id_Persona: localStorage.getItem("idPersona"),
                    sec_Id_Sector: JSON.parse(localStorage.getItem('infoSesion')).sec_Id_Sector
                }
            });
        }
    }

    const_regex = {
        alphaSpaceRequired: /^[a-zA-Z]{3}[a-zA-Z\d\s]{0,37}$/,
        formatoFecha: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    }

    handleChangeDomicilio = (e) => {
        this.setState({
            domicilio: {
                ...this.state.domicilio,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
    }

    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value.toUpperCase()
            }
        })
        if (e.target.name === "per_Categoria") {
            switch (e.target.value) {
                default:
                    this.setState({
                        categoriaSeleccionada: false,
                        msjCategoriaSeleccionada: "Debes seleccionar una categoria valida.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "ADULTO_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita todas las pestañas / Bautizado por defecto.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "ADULTO_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita todas las pestañas / Bautizado por defecto.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_HOMBRE":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita las perstañas: Personales, Eclesiasticos y Hogar.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "JOVEN_MUJER":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita las perstañas: Personales, Eclesiasticos y Hogar.",
                        habilitaPerBautizado: true,
                        form: {
                            ...this.state.form,
                            // per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "NIÑO":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita solo la pestaña Hogar / NO Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
                case "NIÑA":
                    this.setState({
                        categoriaSeleccionada: true,
                        msjCategoriaSeleccionada: "Habilita solo la pestaña Hogar / NO Bautizado por defecto.",
                        habilitaPerBautizado: false,
                        form: {
                            ...this.state.form,
                            per_Bautizado: false,
                            [e.target.name]: e.target.value.toUpperCase()
                        }
                    });
                    break;
            }
        }
        if (e.target.name === "per_Bautizado") {
            if (e.target.checked) {
                this.setState({
                    // per_Bautizado: true,
                    form: {
                        ...this.state.form,
                        per_Bautizado: true
                    }
                });
            } else {
                this.setState({
                    // per_Bautizado: false,
                    form: {
                        ...this.state.form,
                        [e.target.name]: false
                    }
                });
            }
        }
        if (e.target.name === "per_Nombre") {
            if (!this.const_regex.alphaSpaceRequired.test(e.target.value)) {
                this.setState({
                    per_Nombre_NoValido: true
                });
            } else {
                this.setState({
                    per_Nombre_NoValido: false
                });
            }
        }
        if (e.target.name === "per_Apellido_Paterno") {
            if (!this.const_regex.alphaSpaceRequired.test(e.target.value)) {
                this.setState({
                    per_Apellido_Paterno_NoValido: true
                });
            } else {
                this.setState({
                    per_Apellido_Paterno_NoValido: false
                });
            }
        }
        /* if (e.target.name === "per_Fecha_Nacimiento") {
            if (!this.const_regex.formatoFecha.test(e.target.value)) {
                this.setState({ per_Fecha_Nacimiento_NoValido: true });
            } else {
                this.setState({
                    per_Fecha_Nacimiento_NoValido: false
                });

            }
        } */
        if (e.target.name === "per_Fecha_Nacimiento") {
            if (e.target.value === '') {
                this.setState({ per_Fecha_Nacimiento_NoValido: true });
            }
            else {
                this.setState({
                    per_Fecha_Nacimiento_NoValido: false
                });
            }
        }
    }

    changeRFCSinHomo = (str) => {
        this.setState({
            form: {
                ...this.state.form,
                per_RFC_Sin_Homo: str.toUpperCase()
            }
        })
    }

    changeEstadoCivil = (str) => {
        this.setState({
            form: {
                ...this.state.form,
                per_Estado_Civil: str.toUpperCase()
            }
        })
    }

    fnGuardaPersona = async (datos) => {
        try {
            await helpers.authAxios.post(this.url + "/persona/AddPersonaDomicilioHogar", datos)
                .then(res => {
                    if (res.data.status === "success") {
                        alert("Datos guardados satisfactoriamente");
                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                    } else {
                        alert("Error: No se pudo guardar. Revise los datos ingresados");
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    fnEditaPersona = async (datos) => {
        if (datos.per_Estado_Civil === "SOLTERO(A) CON HIJOS"
            || datos.per_Estado_Civil === "CONCUBINATO") {
            datos.per_Fecha_Boda_Civil = "01/01/1900";
            datos.per_Fecha_Boda_Eclesiastica = "01/01/1900";
            datos.per_Num_Acta_Boda_Civil = "";
            datos.per_Oficialia_Boda_Civil = "";
            datos.per_Registro_Civil = "";
            datos.per_Nombre_Conyuge = "";
            datos.per_Libro_Acta_Boda_Civil = "";
        }
        if (datos.per_Estado_Civil === "SOLTERO(A)") {
            datos.per_Fecha_Boda_Civil = "01/01/1900";
            datos.per_Fecha_Boda_Eclesiastica = "01/01/1900";
            datos.per_Num_Acta_Boda_Civil = "";
            datos.per_Oficialia_Boda_Civil = "";
            datos.per_Registro_Civil = "";
            datos.per_Nombre_Conyuge = "";
            datos.per_Libro_Acta_Boda_Civil = "";
            datos.per_Nombre_Hijos = "";
            datos.per_Cantidad_Hijos = "0";
        }
        let info = {
            id: 0,
            PersonaEntity: datos,
            ComentarioHTE: this.state.ComentarioHistorialTransacciones.toUpperCase()
        };
        try {
            await helpers.authAxios.put(this.url + "/persona/" + localStorage.getItem("idPersona"), info)
                .then(res => {
                    if (res.data.status === "success") {
                        // alert(res.data.mensaje);
                        setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1500);
                        setTimeout(() => {
                            document.location.href = '/ListaDePersonal'
                        }, 3500);
                    } else {
                        // alert(res.data.mensaje);
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: res.data.mensaje,
                                modalShow: false
                            });
                        }, 1500);
                    }
                });
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            // setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    fnGuardaPersonaEnHogar = async (datos, jerarquia, hdId) => {
        try {
            await helpers.authAxios.post(this.url + "/persona/AddPersonaHogar/" + jerarquia + "/" + hdId, datos)
                .then(res => {
                    if (res.data.status === "success") {
                        this.setState({
                            mensajeDelProceso: "Procesando...",
                            modalShow: true
                        });
                        setTimeout(() => {
                            this.setState({
                                mensajeDelProceso: "Los datos fueron grabados satisfactoriamente."
                            });
                        }, 1500);
                        setTimeout(() => {
                            document.location.href = '/ListaDePersonal'
                        }, 3500);
                    } else {
                        alert("Error: No se pudo guardar. Revise los datos ingresados");
                    }
                })
        } catch (error) {
            alert("Error: Hubo un problema en la comunicacion con el servidor. Intente mas tarde.");
            setTimeout(() => { document.location.href = '/ListaDePersonal'; }, 3000);
        }
    }

    componentWillUnmount() {
        this.setState({
            form: {}
        });
    }

    handle_ComentarioHistorialTransacciones = (e) => {
        this.setState({ ComentarioHistorialTransacciones: e.target.value })
    }

    render() {

        return (
            <Layout>
                <PersonaForm
                    onChange={this.handleChange}
                    FrmValidaPersona={this.state.FrmValidaPersona}
                    bolPersonaEncontrada={this.state.bolPersonaEncontrada}
                    setFrmValidaPersona={this.setFrmValidaPersona}
                    setBolPersonaEncontrada={this.setBolPersonaEncontrada}
                    form={this.state.form}
                    onChangeDomicilio={this.handleChangeDomicilio}
                    domicilio={this.state.domicilio}
                    /* hogar={this.state.hogar} */
                    categoriaSeleccionada={this.state.categoriaSeleccionada}
                    msjCategoriaSeleccionada={this.state.msjCategoriaSeleccionada}
                    habilitaPerBautizado={this.state.habilitaPerBautizado}
                    per_Nombre_NoValido={this.state.per_Nombre_NoValido}
                    per_Apellido_Paterno_NoValido={this.state.per_Apellido_Paterno_NoValido}
                    per_Fecha_Nacimiento_NoValido={this.state.per_Fecha_Nacimiento_NoValido}
                    changeRFCSinHomo={this.changeRFCSinHomo}
                    changeEstadoCivil={this.changeEstadoCivil}
                    fnGuardaPersona={this.fnGuardaPersona}
                    fnGuardaPersonaEnHogar={this.fnGuardaPersonaEnHogar}
                    tituloAgregarEditar={this.state.tituloAgregarEditar}
                    boolAgregarNvaPersona={this.state.boolAgregarNvaPersona}
                    boolComentarioEdicion={this.state.boolComentarioEdicion}
                    handle_ComentarioHistorialTransacciones={this.handle_ComentarioHistorialTransacciones}
                    ComentarioHistorialTransacciones={this.state.ComentarioHistorialTransacciones}
                    fnEditaPersona={this.fnEditaPersona}
                />
                {/*Modal success*/}
                <Modal isOpen={this.state.modalShow}>
                    {/* <ModalHeader>
                        Solo prueba.
                    </ModalHeader> */}
                    <ModalBody>
                        {this.state.mensajeDelProceso}
                    </ModalBody>
                    {/* <ModalFooter>
                        <Button color="secondary" onClick={this.handle_modalClose}>Cancel</Button>
                    </ModalFooter> */}
                </Modal>
            </Layout>
        )
    }
}

export default RegistroDePersonal;