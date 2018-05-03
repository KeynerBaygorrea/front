import React from 'react';
import '../style/style.css';
import '../style/table.css';
import '../style/button.css';
import '../style/fileInput.css';
import '../style/label.css';
import '../flexboxgrid.min.css';
import TableResults from './TableResults';
import { PageHeader } from 'react-bootstrap';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            excelUrl: '',
            select: false,
            usuario: '',
            value: 'a',
            archivo: null,
            total_inserciones: 0,
            good_files: null,
            bad_files: null,
            uniqueId: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var data = new FormData();
        data.append('file', this.state.file);
        data.append('tipo', this.state.value);
        data.append('name', this.state.usuario);

        console.log(this.state.file);
        this.setState((prevState) => ({ uniqueId: prevState.uniqueId + 1}))

        let sentData = {
            method: 'POST',
            body: data
        };

        fetch('http://104.236.94.13/recaudaciones/upload/', sentData)
            .then(response => {
                response.json()
                    .then((json) => this.setState({
                        archivo: json['file'],
                        total_inserciones: json['total_inserciones'],
                        good_files: json['good_files'],
                        bad_files: json['bad_files'],
                        select: true
                    })
                    );
            })
            .catch(error => {
                console.error(error)
            });
    }

    handleFileChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                excelUrl: reader.result,
            });
        }
        reader.readAsDataURL(file)
    }

    handleChange(event) {
        this.setState({ usuario: event.target.value2 });
    }

    render() {
        const wellStyles = { color: "white" };
        return (
            <div>
                <PageHeader style={wellStyles}>Módulo Carga de Datos</PageHeader>
                <div className="addExcel" >
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <label className="label">
                            Usuario:
                            <input
                                className="input input_usuario"
                                type="text"
                                value={this.state.usuario}
                                onChange={(e) => { this.setState({ usuario: e.target.value }) }}
                            />
                        </label>
                        <input className="fileInput"
                            type="file"
                            onChange={(e) => this.handleFileChange(e)} />
                        <label>
                            <select
                                className="input"
                                value={this.state.value}
                                onChange={(e) => { this.setState({ value: e.target.value }) }}
                            >
                                <option value="a" disabled>Tipo de Archivo</option>
                                <option value="excel">Excel (.xls)</option>
                                <option value="zip">Zip (.zip)</option>
                            </select>
                        </label>
                        <button
                            disabled={this.state.excelUrl.trim() === ''}
                            className="myButton"
                            type="submit"
                            onClick={(e) => this.handleSubmit(e)}>Subir Archivo</button>
                    </form>
                    <hr />
                    <div key={this.state.uniqueId}>
                        <TableResults
                            archivo={this.state.archivo}
                            total_inserciones={this.state.total_inserciones}
                            good_files={this.state.good_files}
                            bad_files={this.state.bad_files}
                            select={this.state.select}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;