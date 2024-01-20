import React, { Component } from 'react';
import './Table.css';

export default class Table extends Component {

    componentDidMount(props) {
    }

    generateTable() {
        const columns = this.props.cols;

        return(
            <table>
                <thead>
                    <tr>
                        { columns.map(col => <th>{ col }</th>) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        { columns.map(col => <td>x</td>) }
                    </tr>
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
