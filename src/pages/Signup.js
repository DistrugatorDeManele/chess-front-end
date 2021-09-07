import React from 'react';
import '../CSS/signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import { Redirect } from 'react-router-dom';
export default class Settings extends React.Component  {
    constructor(props){
        super(props);
        this.socket = this.props.socket;
        this.send = this.send.bind(this);
    }
    send(){
        this.socket.emit('newUser', 
        {username: document.getElementById('input1').value,
        email: document.getElementById('input2').value,
        password: document.getElementById('input3').value
        });
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
                        <label id = "label"> Username </label>
                        <input id = "input1"></input>
                    </div>
                    <div id = "box">
                        <label id = "label">Email</label>
                        <input id = "input2"></input>
                    </div>
                    <div id = "box">
                        <label id = "label">Password</label>
                        <input id = "input3"></input>
                    </div>
                    <div>
                        <button id = "signup-button" onClick = {this.send}> Create Account</button>
                    </div>
                </div>
            </div>
        );
    }
}