import React, { useState, useReducer } from 'react';
import Table from '../components/Table';
import axios from 'axios';
import './Home.css';
import AddButton from '../components/AddButton';
import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from '../full_logo.png';
import CloseButton from '../components/CloseButton';
import Button from '../components/Button';
import Preview from '../components/Preview';


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

    const [data, setData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [formData, setFormData] = useState({
        orden: '',
        paqueteria: '',
        guia: '',
        fecha: '',
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [selected, setSelected] = useState("");

    // Modal.setAppElement('#test');

    function getOrdenList(data) {
        return Object.keys(data).map(orden => data[orden]);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50em',
            height: '30em',
        },
    };

    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataObject = new FormData(e.target);

        const formDataPlainObject = {};
            formDataObject.forEach((value, key) => {
            formDataPlainObject[key] = value;
        });

        formDataPlainObject["fecha"] = startDate;

        addTracker(
            formDataPlainObject.orden,
            formDataPlainObject.paqueteria.toLowerCase(),
            formDataPlainObject.fecha,
            formDataPlainObject.guia
        );
        // closeModal();
    };

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
        // check if paqueteria is not other
        // ...
        console.log(paqueteria);
        axios.post('http://localhost:3001/' + paqueteria, {
            "guia": guia,
            "orden": orden,
            "fecha": fecha,
        })
        .then(function (response) {
            // this feels wrong
            data[orden] = response.data;
            setData(data);
            closeModal();
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }

    return (
        <div className='Home'>
            <div className='Orders'>
                <h2 className='title'>Ordenes</h2>
                <AddButton onClick={openModal} />
                <Table cols={[
                    'Orden de compra', 
                    'Paquetería', 
                    'Fecha de orden', 
                    'Guía',
                    'Estado'
                ]} data={getOrdenList(data)}
                   setSelected={setSelected} />
            </div>
            <div className='Add'>
                <h2 className='title'>Vista Previa</h2>
                <Preview selected={getOrdenList(data).length > 0 && selected !== "" ? data[selected] : undefined}/>
            </div>

            <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                <CloseButton onClick={closeModal}/>
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>AGREGAR ORDEN</h2>
                <form className='AddForm' onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Orden de Compra</th>
                                <th>Paquetería</th>
                                <th>Guía</th>
                                <th>Fecha de Orden</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input name="orden" placeholder='Orden de Compra' onChange={handleChange}/></td>
                                <td>
                                    <select name="paqueteria" id="paqueteria" onChange={handleChange}>
                                        <option disabled defaultValue={true} value></option>
                                        <option value="potosinos">Potosinos</option>
                                        <option value="tresguerras">Tresguerras</option>
                                        <option value="estafeta">Estafeta</option>
                                        <option value="paquetexpress">Paquetexpress</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </td>
                                <td><input name="guia" placeholder='Guía' onChange={handleChange}/></td>
                                <td><DatePicker selected={startDate} dateFormat={"dd/MM/yyyy"} onChange={(date) => setStartDate(date)} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="submit">
                        <Button type="submit" text="Agregar"/>
                    </div>
                </form>
                <img className="full-logo" src={logo} />
            </Modal>
        </div>
    )
}
