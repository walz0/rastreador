import React from 'react';
import './Button.css';

export default function Button(props) {
  return (
    <button className='Button' type={props.type} onClick={props.onClick}>{props.text}</button>
  )
}
