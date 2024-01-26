import React from 'react';
import './CloseButton.css';

export default function CloseButton(props) {
  return (
    <div className='CloseButton' onClick={props.onClick}>𐌗</div>
  )
}
