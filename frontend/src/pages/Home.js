import React, { Component } from 'react';
import Table from '../components/Table';
import './Home.css';

export default class Home extends Component {
    render() {
        return (
            <div className='Home'>
                <div className='Orders'>
                    <h2 className='title'>Ordenes</h2>
                    <Table cols={['Order ID', 'Date Ordered', 'Guía', 'Paquetería', 'Status', 'Rastrea']} />
                </div>
                <div className='Add'>
                    <h2 className='title'>Agreger Orden</h2>
                </div>
            </div>
        )
    }
}
