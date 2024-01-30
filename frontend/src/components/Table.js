import React, { Component } from 'react';
import './Table.css';

export default class Table extends Component {

    componentDidMount(props) {
    }

    exampleRow(orden, paqueteria, fecha, guia, estado) {
        return(
            <tr onClick={() => this.props.setSelected(orden)}>
                <td>{orden}</td>
                <td>{paqueteria}</td>
                <td>{fecha}</td>
                {/* <td>{embarcada}</td>
                <td>{entregada}</td> */}
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
                            row.orden,
                            row.paqueteria,
                            row.fecha,
                            // new Date(row.embarcada).toLocaleDateString() + " " + new Date(row.embarcada).toLocaleTimeString(),
                            // new Date(row.entregada).toLocaleDateString() + " " + new Date(row.entregada).toLocaleTimeString(),
                            row.guia,
                            row.estado,
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
