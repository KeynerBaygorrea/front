/*
Autor: Ccopa Mamani, Andrés
correo: andres.ccopa@unmsm.edu.pe
Team AlphaZero
Fecha: julio 2018
*/

import React from 'react'

class ResultadoRow extends React.Component {

  render() {
    if (this.props.tipo === 'good') {
      if (this.props.subtipo === 'insert') {
        return (
          <tr>
            <td className="td cursor" onClick={(e)=>this.props.openModalInsertados(this.props.content.registros_insertados_detalle)}>{this.props.number}</td>
            <td className="td cursor" onClick={(e)=>this.props.openModalInsertados(this.props.content.registros_insertados_detalle)}>{this.props.content.filename}</td>
            <td className="td cursor" onClick={(e)=>this.props.openModalInsertados(this.props.content.registros_insertados_detalle)}>{this.props.content.registros_insertados}</td>
          </tr>
        )
      } else {
        return (
          <tr>
            <td className="td cursor" onClick={(e)=>this.props.openModalDuplicados(this.props.content.registros_duplicados_detalle)}>{this.props.number}</td>
            <td className="td cursor" onClick={(e)=>this.props.openModalDuplicados(this.props.content.registros_duplicados_detalle)}>{this.props.content.filename}</td>
            <td className="td cursor" onClick={(e)=>this.props.openModalDuplicados(this.props.content.registros_duplicados_detalle)}>{this.props.content.registros_excluidos}</td>
          </tr>
        )
      }
    } else {
      return (
        <tr>
          <td className="td">{this.props.number}</td>
          <td className="td">{this.props.content.file}</td>
          <td className="td">{this.props.content.problema}</td>
        </tr>
      )
    }
  }
}

export default ResultadoRow;