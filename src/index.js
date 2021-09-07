import React from 'react';
import ReactDOM from 'react-dom';
import Homepage from './pages/Homepage';
import Game from './pages/Game';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
window.connected = false;
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
        <Route path='/login'>
          <Login socket = {socket}/>
        </Route>
        <Route path='/signup'>
          <Signup socket = {socket}/>
        </Route>
        <Route path="/game">
          <Game socket={socket} />
        </Route>
        <Route path='/settings'>
          <Settings/>
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