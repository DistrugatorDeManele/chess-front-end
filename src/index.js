import React from 'react';
import ReactDOM from 'react-dom';
import Homepage from './Homepage';
import Game from './Game';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";


const io = require('socket.io-client');
const socket = io('http://localhost:4000/');
ReactDOM.render(
  <Auth0Provider
  domain="dev-siz1fhi3.eu.auth0.com"
  clientId="LpQoWiE53IpYKkNeJSOn5XQBObw322Wb"
  redirectUri={window.location.origin}
  >
    <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/game">
          <Game socket={socket} />
        </Route>
        <Route path="/">
          <Homepage socket={socket} />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  </Auth0Provider>,
  document.getElementById("root")
);