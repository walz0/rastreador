import React, { useState } from 'react';
import Table from '../components/Table';
import axios from 'axios';
import './Home.css';
import AddButton from '../components/AddButton';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from '../full_logo.png';


export default function Home() {
    /*
        FACTURAR A
        PROVEEDOR
        ORDEN DE COMPRA
        FECHA
        CONDICIONES DE PAGO
        CANTIDAD
        CODIGO
        COSTO UNITARIO
        TOTAL
    */

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());

    // Modal.setAppElement('#test');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '35vw',
            height: '40vh',
        },
    };

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#2e479b';
    }

    function closeModal() {
        setIsOpen(false);
    }

    function addTracker(orden, paqueteria, fecha, guia) {
        axios.post('http://localhost:3001/potosinos', {
            "guia": "3026756050"
        })
        .then(function (response) {
            console.log(response.data);
            setData(data.concat(response.data));
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }

    return (
        <div className='Home'>
            <div className='Orders'>
                <h2 className='title'>Ordenes</h2>
                <AddButton onClick={addTracker} />
                <Table cols={[
                    'Orden de compra', 
                    'Paquetería', 
                    'Fecha de orden', 
                    'Embarcada', 
                    'Entregada', 
                    'Guía',
                    'Estado'
                ]} data={data} />
            </div>
            <div className='Add'>
                <h2 className='title'>Vista Previa</h2>
            </div>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>AGREGAR ORDEN</h2>
                <form className='AddForm'>
                    <input placeholder='Guía'/>
                    <select name="Paqueteria" id="paqueteria">
                        <option value="potosinos">Potosinos</option>
                        <option value="tresguerras">Tresguerras</option>
                        <option value="estafeta">Estafeta</option>
                        <option value="paquetexpress">Paquetexpress</option>
                        <option value="otro">Otro</option>
                    </select>
                    <DatePicker selected={startDate} dateFormat={"DD/MM/YYYY"} onChange={(date) => setStartDate(date)} />
                </form>
                <button onClick={closeModal}>close</button>
                <img className="full-logo" src={logo} />
            </Modal>
        </div>
    )
}
