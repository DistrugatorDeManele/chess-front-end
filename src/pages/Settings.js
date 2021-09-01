import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import '../CSS/settings.css'
import {Helmet} from "react-helmet";
export default class Settings extends React.Component  {
    render(){
        return(
            <div>
                <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                </Helmet>
                <header id="hp-header">
                    <div id="title">
                            <a id="title-link" href="https://react-upk3at.stackblitz.io">
                            <h1 id="chessworld">ChessWorld</h1>
                            </a>
                        <a id="home-link" href="https://react-upk3at.stackblitz.io/">
                            {' '}
                                <h3 id="home">Home</h3>
                        </a>
                        <a>
                            <AuthenticationButton />
                        </a>
                    </div>
                    <Link
                        to={{
                            pathname: '/settings',
                            state: { fromDashboard: true }
                        }}
                    >
                        <FontAwesomeIcon id = "settings-icon" icon={faCog} size = "3x" color = 'white'/>
                    </Link>
                </header>
                <div id = "settings-box"><h1 id = "account-title"> Account </h1>
                <h3> Username:</h3></div>
            </div>
        );
    }
}