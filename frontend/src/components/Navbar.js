import React, { Component } from 'react';
import './Navbar.css';
import logo from '../rrm_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default class Navbar extends Component {
    render() {
        return (
            <div className="Navbar">
                <a href='/'>
                    <img className="logo" src={logo} alt="logo" />
                </a>
                <ul>
                    {/* <li className='name'>AIDAN WALZ</li> */}
                    <li><a href="/about">Hogar</a></li>
                    <li><a href="/contact">Historia</a></li>
                </ul>                
            </div>
        )
    }
}