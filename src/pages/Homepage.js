import React from 'react';
import '../CSS/hp.css';
import User from '../User.js';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import 'font-awesome/css/font-awesome.min.css';
import {Helmet} from "react-helmet";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.genereaza(),
      random: true,
      cautare: false,
      gasit: false
    };
    this.socket = this.props.socket;
    this.genereaza = this.genereaza.bind(this);
    this.joaca = this.joaca.bind(this);
  }
  componentDidMount() {
    this.socket.on(
      'gasit',
      function (cod) {
        this.setState({ link: cod });
        this.setState({ gasit: true });
      }.bind(this)
    );
  }
  genereaza() {
    var link1 = 'https://react-upk3at.stackblitz.io/game?';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 1; i <= 10; i++) {
      link1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({ link: link1 });
    //this.socket.emit('invite', window.location.search.substring(1));
    return link1;
  }
  joaca() {
    this.setState({ random: false });
    this.setState({ cautare: true });
    var nimic = null;
    this.socket.emit('cautare', nimic);
  }
  render() {
    return (
      <div>
        <Helmet>
        </Helmet>
        {this.state.gasit && (
          <Redirect
            to={{
              pathname: '/game',
              search: this.state.link,
              state: { fromDashboard: true }
            }}
          />
        )}
          <div id="title">
            <a id="title-link" href="https://react-upk3at.stackblitz.io">
              <h1 id="chessworld">ChessWorld</h1>
            </a>
            <a id="home-link" href="https://react-upk3at.stackblitz.io/">
              {' '}
              <h3 id="home">Home</h3>
            </a>
            {!User.Connected && <a id = "register" href = '/signup'>
              <h3> Sign Up </h3>
             </a>}
            <a id = "settings-icon"  href = "/settings">
          <FontAwesomeIcon icon={faCog} size = "3x" color = 'white'/>
          </a>
          </div>
        <div id="invite">
          {' '}
          <p id="invite-friend">Invite your friend with this link !</p>
          <input
            name="link"
            id="link"
            type="text"
            value={this.state.link}
            size="30"
            autoFocus
            readOnly
          />
          <Link
            to={{
              pathname: '/game',
              search: this.state.link.substring(this.state.link.length - 10),
              state: { fromDashboard: true }
            }}
          >
            <button id="playf" >
              {' '}
              <div>Play with friend</div>
            </button>
          </Link>
        </div>
        {this.state.random && (
          <button id="playr" className="ms-3" onClick={this.joaca}>
            {' '}
            Play with random{' '}
          </button>
        )}
        {this.state.cautare && (
          <h2 id="searching"> Searching for player... </h2>
        )}
        <div id="main-box">
          <button id="multiplayer">
            {' '}
            <div id="text-mp">Multiplayer </div>
            <div id="text2-mp">Play against a friend or a random opponent </div>
          </button>{' '}
          <button id="computer">
            {' '}
            <div id="text-pc">Computer </div>
            <div id="text2-pc">Train against AI </div>
          </button>{' '}
        </div>
        <FontAwesomeIcon icon={["far", "coffee"]} />
      </div>
    );
  }
}
