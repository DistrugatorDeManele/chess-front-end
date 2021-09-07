import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import '../CSS/settings.css'
import {Helmet} from "react-helmet";
import Header from './Header';
export default class Settings extends React.Component  {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                </Helmet>
                <Header></Header>
                <div id = "settings-box"><h1 id = "account-title"> Account </h1>
                <h3 id = "username"> Username:</h3></div>
            </div>
        );
    }
}