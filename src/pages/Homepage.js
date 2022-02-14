import React from 'react';
import '../CSS/hp.css';
import 'react-awesome-button/dist/styles.css';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'font-awesome/css/font-awesome.min.css';
import {Helmet} from "react-helmet";
import Header from './Header.js'
import King from '../Images/king.jpg'
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: ' ',
      random: true,
      cautare: false,
      gasit: false
    };
    this.socket = this.props.socket;
    this.genereaza = this.genereaza.bind(this);
    this.joaca = this.joaca.bind(this);
  }
  componentDidUpdate() {
    this._isMounted = true;
    this.setState({link: this.genereaza()});
    this.socket.on(
      'gasit',
      function (cod) {
        if (this._isMounted) {
          this.setState({ link: cod });
          this.setState({ gasit: true });
        }
      }.bind(this)
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  genereaza() {
    var link1 = '';
    var link2 = 'http://localhost:3000/game?';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 1; i <= 10; i++) {
      link1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    link1 = link2 + link1;
    this.setState({ link: link1 });
    //this.socket.emit('invite', window.location.search.substring(1));
    return link1;
  }
  joaca() {
    // this.setState({ random: false });
    // this.setState({ cautare: true });
    // var nimic = null;
    // this.socket.emit('cautare', nimic);
  }
  //<img src = {King} height = {100} width = {100}></img>
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
        <Header></Header>
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
          <Link to = '/online'>
          <button id="multiplayer">
            {' '}
            <div id="text-mp">Multiplayer</div>
            <div id="text2-mp">Play against a friend or a random opponent </div>
          </button>{' '}</Link>
          <Link to = "/AIsetup">
          <button id="computer">
            {' '}
            <div id="text-pc">Computer </div>
            <div id="text2-pc">Train against AI </div>
          </button>{' '}
          </Link>
        </div>
      </div>
    );
  }
}
