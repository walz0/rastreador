import React from 'react';
import History from './History';
import potosinos from '../paqueterias/potosinos.png';
import estafeta from '../paqueterias/estafeta.png';
import paquetexpress from '../paqueterias/paquetexpress.png';
import tresguerras from '../paqueterias/tresguerras.webp';
import './Preview.css';

export default function Preview(props) {
    function paqueteriaImage(paqueteria) {
        switch (paqueteria.toLowerCase()) {
            case "potosinos":
                return potosinos;
            case "paquetexpress":
                return paquetexpress;
            case "tresguerras":
                return tresguerras;
            case "estafeta":
                return estafeta;
        }
    }

    return (
        <div className='Preview'>
            { props.selected !== undefined ? 
            <div>
                <div className='orden'>{props.selected.orden}</div>
                <div className='info'>
                    <img className="paqueteria" src={paqueteriaImage(props.selected.paqueteria)}></img>
                    <div className='entregada'>ENTREGADA: {(new Date(props.selected.entregada)).toLocaleString()}</div>
                    <div className='embarcada'>EMBARCADA: {(new Date(props.selected.embarcada)).toLocaleString()}</div>
                </div>
                <h3>Historia</h3>
                <History history={props.selected.historia} />
            </div>
            : <div>
                <div className='orden'></div>
                <div className='info'></div>
            </div>}
        </div>
    )
}
