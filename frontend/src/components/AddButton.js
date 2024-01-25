import React from 'react';
import './AddButton.css';

export default function AddButton(props) {
  return (
    <div className='AddButton' onClick={props.onClick}>＋ Agregar Orden</div>
  )
}
