import React from 'react';
import Header from './Header.js';
import '../CSS/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.socket = this.props.socket;
        this.send = this.send.bind(this);
    }
    send(){
        window.connected = true;
        this.forceUpdate();
    }
    render(){
        return(
            <div>
                {window.connected && <Redirect
                    to={{
                    pathname: '/',
                    state: { fromDashboard: true }
                    }}
                />}
                <Header></Header>
                <div id = "signup-box">
                    <div id = "box">
                        <FontAwesomeIcon id = "user-icon" icon={faUser} size = "2x" color = 'white'/>
                        <input id = "input11" placeholder = "Username or Email"></input>
                    </div>
                    <div id = "box">
                        <FontAwesomeIcon id = "psw-icon" icon = {faKey} size = "2x" color = 'white' />
                        <input id = "input31" placeholder = "Password"></input>
                    </div>
                    <div>
                        <button id = "signup-button" onClick = {this.send}> <h4>Log In </h4></button>
                    </div>
                </div>
            </div>
       );
    }
}        