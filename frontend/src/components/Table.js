import React, { Component } from 'react';
import './Table.css';

export default class Table extends Component {

    componentDidMount(props) {
    }

    exampleRow(orden, paqueteria, fecha, embarcada, entregada, guia, estado) {
        return(
            <tr>
                <td>{orden}</td>
                <td>{paqueteria}</td>
                <td>{fecha}</td>
                <td>{embarcada}</td>
                <td>{entregada}</td>
                <td>{guia}</td>
                <td>{estado}</td>
            </tr>
        )
    }

    generateTable() {
        const columns = this.props.cols;
        const data = this.props.data;

        return(
            <table>
                <thead>
                    <tr>
                        { columns.map(col => <th>{ col }</th>) }
                    </tr>
                </thead>
                <tbody>
                    { data.map(row => 
                        this.exampleRow(
                            "STA-012702",
                            row.paqueteria,
                            "undefined",
                            row.embarcada,
                            row.entregada,
                            row.guia,
                        )
                    ) }
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className='Table'>
                { this.generateTable() }
            </div>
        );
  }
}
