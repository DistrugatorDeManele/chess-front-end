import React from 'react';
import '../CSS/signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import User from '../User.js'
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
        console.log("am intrat");
        User.Connected = true;
    }
    render(){
        return(
            <div>
                <div id="title">
                    <a id="title-link" href="/">
                        <h1 id="chessworld">ChessWorld</h1>
                    </a>
                    <a id="home-link" href="/">
                        <h3 id="home">Home</h3>
                     </a>
                    <a id = "register" href = '/signup'>
                        <h3> Sign Up </h3>
                    </a>
                    <a id = "settings-icon"  href = "/settings">
                        <FontAwesomeIcon icon={faCog} size = "3x" color = 'white'/>
                    </a>
                </div>
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