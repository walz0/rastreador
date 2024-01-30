import React from 'react';
import './History.css';

export default function History(props) {

    function getItems(history) {
        return history.map(evento => {
            console.log(evento);
            return (
                <div className='evento'>
                    <div className='estado'>{evento.estado}</div>
                    <div className='fechahora'>{(new Date(evento.fechahora)).toLocaleString()}</div>
                    <div className='sucursal'>{evento.sucursal}</div>
                </div>
            )
        })
    }

    return (
        <div className='History'>
            { getItems(props.history) }
        </div>
    )
}
