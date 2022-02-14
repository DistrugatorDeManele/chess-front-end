import React from 'react';
import LoginButton from './LoginAuth0';
import AuthenticationButton from './AuthenticationButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import '../CSS/header.css';
export default class Header extends React.Component {
    constructor(props){
        super(props);
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
                    {/* {!window.connected && <a id = "register" href = '/signup'>
                        <h3> Sign Up </h3>
                    </a>}
                    {!window.connected && <a id= "login" href = '/login'>
                        <h3>Log In</h3>
                    </a>}*/
                    <a id = "settings-icon"  href = "/settings">
                        <FontAwesomeIcon icon={faCog} size = "3x" color = 'white'/>
                    </a> }
                    <AuthenticationButton id = "log"/>
                </div>
          </div>
        );
    }
}