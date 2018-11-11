/*
Autor: Ccopa Mamani, Andrés
correo: andres.ccopa@unmsm.edu.pe
Team AlphaZero
Fecha: julio 2018
*/

import React from 'react';
import '../style/style.css';
import '../style/table.css';
import '../style/button.css';
import '../style/fileInput.css';
import '../style/label.css';
import '../flexboxgrid.min.css';
import Resultados from './Resultados';
import HelpModal from './HelpModal';
import DuplicadosModal from './DuplicadosModal';
import InsertadosModal from './InsertadosModal';
import CapturaDatos from './CapturaDatos';
import Cabecera from './Cabecera';

/*
//Utlice esto para las pruebas con formato zip y excel
import pruebaZip from './pruebaZip';
import pruebaExcel from './pruebaExcel';
*/

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //usados para la carga de archivos
            excelUrl: '',
            select: false,
            //captura los datos para la carga de archivos
            file: '',
            usuario: 'INVITADO',
            value: '', //zip o excel
            formato: '',
            //almacenamiento de los datos recibidos
            archivo: null,
            total_registros_insertados: 0,
            total_registros_procesados: 0,
            total_registros_excluidos: 0,
            good_files: null,
            bad_files: null,
            status_excel: "",
            no_procesados: 0,
            si_procesados: 0,
            //modal de ayuda
            help: false,
            //modal de detalles de duplicados
            detalle_duplicados: false,
            lista_detalle_duplicados: [],
            //modal de detalles de insertados
            detalle_insertados: false,
            lista_detalle_insertados: []

        };
    }

    //metodo de carga del archivo
    handleSubmit = (e) => {
        e.preventDefault();
        //indicamos que el archivo ha sido enviado
        this.setState({
            select: true
        });
        //cargamos los datos a un FormData
        var data = new FormData();
        data.append('file', this.state.file);
        data.append('tipo', this.state.value);
        data.append('name', this.state.usuario);
        data.append('formato', this.state.formato);
        //escribimos los parametros para el envio tipo POST
        let sentData = {
            method: 'POST',
            body: data
        };
        //indicamos la url a donde enviaremos y recibiremos la data
        fetch('http://192.241.156.50:5000/upload', sentData)
            .then(response => {
                //capturamos la respuesta para zip
                if (this.state.value === "zip") {
                    response.json()
                        .then((json) => this.setState({
                            archivo: json.file,
                            total_registros_insertados: json.good_files.total_registros_insertados,
                            total_registros_procesados: json.good_files.total_registros_procesados,
                            total_registros_excluidos: json.good_files.total_registros_excluidos,
                            good_files: json.good_files.lista_detalle,
                            bad_files: json.bad_files,
                            no_procesados: json.no_procesados,
                            si_procesados: json.si_procesados
                        })
                        );
                }
                //capturamos la respuesta para excel
                else {
                    response.json()
                        .then((json) => this.setState({
                            archivo: json.filename,
                            status_excel: json.status,
                            total_registros_insertados: json.registros_insertados,
                            total_registros_procesados: json.registros_procesados,
                            total_registros_excluidos: json.registros_excluidos,
                            lista_detalle_insertados: json.registros_insertados_detalle,
                            lista_detalle_duplicados: json.registros_duplicados_detalle
                        })
                        );
                }
            })
            //capturamos cualqueir error producido
            .catch(error => {
                alert('Error de conexion con la Base de Datos');
                console.error(error);
            });
    }

    //el primer componente que se ejecutará
    componentDidMount() {
        //captura del nombre de llegada
        var name = "nombre";
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.search);
        var usuario = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        //muestra en consola
        console.log(usuario);
        //modificamos el usuario
        if (usuario !== "") {
            this.setState({
                usuario: usuario
            })
        }

        /*
        //Utilice esta parte para pruebas con formato zip
        this.setState({
            value: 'zip',
            archivo: pruebaZip.file,
            total_registros_insertados: pruebaZip.good_files.total_registros_insertados,
            total_registros_procesados: pruebaZip.good_files.total_registros_procesados,
            total_registros_excluidos: pruebaZip.good_files.total_registros_excluidos,
            good_files: pruebaZip.good_files.lista_detalle,
            bad_files: pruebaZip.bad_files,
            no_procesados: pruebaZip.no_procesados,
            si_procesados: pruebaZip.si_procesados
        })
        */

        /*
        //Utilice esta parte para pruebas con formato excel
        this.setState({
            value: 'excel',
            archivo: pruebaExcel.filename,
            status_excel: pruebaExcel.status,
            total_registros_insertados: pruebaExcel.registros_insertados,
            total_registros_procesados: pruebaExcel.registros_procesados,
            total_registros_excluidos: pruebaExcel.registros_excluidos,
            lista_detalle_insertados: pruebaExcel.registros_insertados_detalle,
            lista_detalle_duplicados: pruebaExcel.registros_duplicados_detalle
        })
        */
    }

    //metodo de modificación de archivos
    handleFileChange = (e) => {
        e.preventDefault();
        //restauramos los parametros frente a una posible nueva carga
        this.setState({
            archivo: null,
            total_inserciones: 0,
            good_files: [],
            bad_files: [],
            status_excel: "",
            select: false
        })

        try {
            //capturamos los datos necesarios del archivo seleccionado
            let reader = new FileReader();
            let file = e.target.files[0];
            let tipoFile = '';
            //capturamos el formato
            if (file.name.endsWith(".xls")) {
                tipoFile = 'excel'
                reader.onloadend = () => {
                    this.setState({
                        file: file,
                        excelUrl: reader.result,
                        value: tipoFile
                    });
                }
                reader.readAsDataURL(file)
            } else if (file.name.endsWith(".zip")) {
                tipoFile = 'zip'
                reader.onloadend = () => {
                    this.setState({
                        file: file,
                        excelUrl: reader.result,
                        value: tipoFile
                    });
                }
                reader.readAsDataURL(file)
            } else {
                document.getElementById('filereader').value = "";
                alert('Archivo no válido.\nSolo se admiten archivos con formato .zip, .xls y .xlsx');
            }
        } catch (e) {
            document.getElementById('filereader').value = "";
            console.error(e);
        }
    }

    //metodo de cambio de formato del archivo (1 o 2)
    changeFormato = (formato) => {
        this.setState(() => ({
            formato: formato
        }))
    }

    //metodo de despliegue de ayuda para la selección del formato
    ayudaModal = () => {
        this.setState(() => ({ help: true }));
    }

    //metodo para el cierre de la ayuda
    handClearSelectedOption = () => {
        this.setState(() => ({ help: false }));
    }

    //capturamos la lista de detalles y desplegamos el modal
    openModalDuplicados = (lista_detalle_duplicados) => {
        this.setState(() => ({
            lista_detalle_duplicados: lista_detalle_duplicados,
            detalle_duplicados: true
        }))
    }

    //cerramos el modal
    closeModalDuplicados = () => {
        this.setState(() => ({
            detalle_duplicados: false
        }))
    }

    //capturamos la lista de detalles y desplegamos el modal
    openModalInsertados = (lista_detalle_insertados) => {
        this.setState(() => ({
            lista_detalle_insertados: lista_detalle_insertados,
            detalle_insertados: true
        }))
    }

    //cerramos el modal
    closeModalInsertados = () => {
        this.setState(() => ({
            detalle_insertados: false
        }))
    }

    render() {
        return (
            <div>
                <Cabecera />
                <div className="vista" >
                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <label className="label">
                                USUARIO: {this.state.usuario}
                            </label>
                        </div>
                    </div>
                    <CapturaDatos
                        value={this.state.value}
                        formato={this.state.formato}
                        excelUrl={this.state.excelUrl}
                        handleFileChange={this.handleFileChange}
                        changeFormato={this.changeFormato}
                        ayudaModal={this.ayudaModal}
                        handleSubmit={this.handleSubmit}
                    />
                    <HelpModal
                        help={this.state.help}
                        handClearSelectedOption={this.handClearSelectedOption}
                    />
                    <br />
                    <hr />
                    <br />
                    <div>
                        <Resultados
                            archivo={this.state.archivo}
                            total_registros_insertados={this.state.total_registros_insertados}
                            total_registros_excluidos={this.state.total_registros_excluidos}
                            total_registros_procesados={this.state.total_registros_procesados}
                            good_files={this.state.good_files}
                            bad_files={this.state.bad_files}
                            status={this.state.status_excel}
                            no_procesados={this.state.no_procesados}
                            si_procesados={this.state.si_procesados}
                            select={this.state.select}
                            tipo={this.state.value}
                            openModalDuplicados={this.openModalDuplicados}
                            lista_detalle_duplicados={this.state.lista_detalle_duplicados}
                            openModalInsertados={this.openModalInsertados}
                            lista_detalle_insertados={this.state.lista_detalle_insertados}
                        />
                    </div>
                    <DuplicadosModal
                        detalle_duplicados={this.state.detalle_duplicados}
                        closeModalDuplicados={this.closeModalDuplicados}
                        lista_detalle_duplicados={this.state.lista_detalle_duplicados}
                    />
                    <InsertadosModal
                        detalle_insertados={this.state.detalle_insertados}
                        closeModalInsertados={this.closeModalInsertados}
                        lista_detalle_insertados={this.state.lista_detalle_insertados}
                    />
                </div>
            </div>
        )
    }
}

export default App;
