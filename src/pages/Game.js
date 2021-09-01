import React, { Component } from 'react';
import { render } from 'react-dom';
import '../CSS/style.css';
import $ from 'jquery';
window.$ = require('jquery');

const Chessboard = require('chessboardjs');
const Chess = require('chess.js');

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.state = {
      history: [],
      both: false,
      da: false
    };

    this.blackSquareGrey = '#696969';
    this.whiteSquareGrey = '#a9a9a9';
    this.game = new Chess();
    this.board = null;
    this.socket.emit('link', window.location.search.substring(1));
  }

  componentDidMount() {
    var config = {
      position: 'start',
      pieceTheme:
        'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
      draggable: true,
      onChange: this.onChange,
      onDrop: this.onDrop,
      onDragStart: this.onDragStart
    };
    this.board = Chessboard('myBoard', config); //IMPORTANT
    this.socket.on(
      'link',
      function(nimic) {
        if (nimic == 'negru') {
          this.board.orientation('black');
        }
        this.setState({ both: true });
      }.bind(this)
    );
    this.socket.on(
      'mutare',
      function(move) {
        this.game.load(move.istorie);
        this.board.position(this.game.fen());
        this.game.load_pgn(move.tabel);
        this.setHistory(this.game.history({ verbose: true }));
      }.bind(this)
    );
    this.socket.on(
      'tabla',
      function(t1) {
        if (t1 != null) this.game.load(t1.istorie);
        this.board.position(this.game.fen());
        if (t1 != null) this.game.load_pgn(t1.tabel);
        this.setHistory(this.game.history({ verbose: true }));
        console.log('Am intrat');
      }.bind(this)
    );
  }

  // only allow pieces to be dragged when the board is oriented
  // in their direction
  onDragStart = (source, piece, position, orientation) => {
    if (
      (this.board.orientation() == 'black' && this.game.turn() == 'b') ||
      (this.board.orientation() == 'white' && this.game.turn() == 'w')
    ) {
      // get list of possible moves for this square
      var moves = this.game.moves({
        square: source,
        verbose: true
      });

      // exit if there are no moves available for this square
      if (moves.length === 0) return;

      // highlight the square they moused over
      this.greySquare(source);
      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        this.greySquare(moves[i].to);
      }
    } else {
      return false;
    }
  };

  removeGreySquares = () => {
    $('#myBoard .square-55d63').css('background', '');
  };

  onDrop = (source, target) => {
    if (
      (this.board.orientation() == 'black' && this.game.turn() == 'b') ||
      (this.board.orientation() == 'white' && this.game.turn() == 'w')
    ) {
      this.removeGreySquares();
      // see if the move is legal
      var move = this.game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      console.log(this.game.move);
      // illegal move
      if (move === null) return 'snapback';
      var mutari = [source, target];
      // updateStatus()
      this.setHistory(this.game.history({ verbose: true }));
      this.socket.emit('mutarecod', window.location.search.substring(1));
      this.socket.emit('mutare', {
        istorie: this.game.fen(),
        tabel: this.game.pgn()
      });
      if (this.game.game_over() == true) {
        alert('Game Over');
      }
    }
  };

  setHistory = history => {
    let ar = [];
    while (history.length > 0) ar.push(history.splice(0, 2));

    this.setState({
      history: ar
    });
  };

  greySquare = square => {
    var $square = $('#myBoard .square-' + square);

    var background = this.whiteSquareGrey;
    if ($square.hasClass('black-3c85d')) {
      background = this.blackSquareGrey;
    }

    $square.css('background', background);
  };

  render() {
    return (
      <div>
        <div id="myBoard" style={{ width: '800px' }} />
        <div id="right-box">
          {!this.state.both && (
            <h2 id="waiting">Waiting for the other player to join...</h2>
          )}
          {this.state.both && <h2 id="waiting2">Both players joined!</h2>}
          <h2 id="istoric">History</h2>
          <ul id="history">
            {this.state.history.map(historyItem => {
              return <li>{historyItem.map(move => move.san + ' ')}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}
