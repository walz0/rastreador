import React, { Component } from 'react';
import Table from '../components/Table';
import './Home.css';

export default class Home extends Component {
    render() {
        return (
            <div className='Home'>
                <h2 className='title'>Ordenes</h2>
                <div className=''></div>
                <Table cols={['Order ID', 'Date Ordered', 'Guía', 'Paquetería', 'Status', 'Rastrea']} />
            </div>
        )
    }
}
