import React, { Component } from 'react';
import { render } from 'react-dom';
import '../CSS/style.css';
import $ from 'jquery';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
window.$ = require('jquery');

import Chessboard from "chessboardjsx";
import Chess from "chess.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.state = {
      history: [],
      both: false,
      da: false,
      minutes1: 10,
      seconds1: 10,
      minutes2: 10,
      seconds2: 10,
      moves: [],
      order: [],
      end: false,
      position: "start",
      orientation: 'white',
      playerColor: 'w'
    };
    this.blackSquareGrey = '#696969';
    this.whiteSquareGrey = '#a9a9a9';
    this.game = new Chess();
    this.socket.emit('link', window.location.search.substring(1));
    this.myInterval = null;
    this.opInterval = null;
    this.tableHistory = this.tableHistory.bind(this);
    this.stopme = this.stopme.bind(this);
    this.stopop = this.stopop.bind(this);
    this.tickme = this.tickme.bind(this);
    this.tickop = this.tickop.bind(this);
    this.timeme = 0;
    this.timeop = 0;
    this.miliseconds = 0;
    this.whattosend = true;
    this.moveOrder = [];
    this.boards = {};
    this.boards[0] = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.specificMove = 0;
    this.nthmove = 0;
    this.incrementOrder = true;
  }

  componentDidMount() { //IMPORTANT
    this.socket.on(
      'link',
      function(nimic) {
        if (nimic == 'negru') {
          this.setState({orientation: 'black'})
          this.setState({playerColor: 'b'})
        }
        this.setState({ both: true });
      }.bind(this)
    );
    this.socket.on(
      'mutare',
      function(move) {
        this.game.load_pgn(move.tabel);
        this.setState({position: this.game.fen()});
        var mutari = move.mutari;
        this.boards = move.table;
        this.setState({moves: mutari});
        this.specificMove = move.mutari[mutari.length - 1];
        if(move.end == true){
          this.state.end = true;
        }
        if(this.incrementOrder == true){
        this.nthmove++;
        var copy = this.state.order;
        copy.push(this.nthmove);
        this.setState({order: copy});
        this.incrementOrder = false;
        }else{
          this.incrementOrder = true;
        }
      }.bind(this)
    );
    this.socket.on(
      'tabla',
      function(t1) {
        if (t1 != null) this.game.load(t1.istorie);
        this.board.position(this.game.fen());
        if (t1 != null) this.game.load_pgn(t1.tabel);
        this.setHistory(this.game.history({ verbose: true }));
      }.bind(this)
    );
    this.socket.on('timer', function(miliseconds){
      this.miliseconds = miliseconds.time;
      if(miliseconds.firstop == true){
        this.tickop();
        this.stopme();
      }
      if(miliseconds.firstop == false){
        this.whattosend = false;
        this.tickme();
        this.stopop();
      }
    }.bind(this)
    );
}
  stopme() {
  if(this.myInterval != null)
  clearInterval(this.myInterval)
  }
  stopop(){
  if(this.opInterval != null)
  clearInterval(this.opInterval)
  }
  tickme(){
    this.startme = new Date().getTime();
    var min = this.state.minutes1;
    var minutes1 = min;
    var seconds1;
    var sec = this.state.seconds1;
    var once = 0;
    this.myInterval = 
    setInterval(() =>{
      this.timeme = new Date().getTime() + this.miliseconds;
      var dif = this.timeme - this.startme;
      var ms = dif % 1000;
      dif = (dif - ms) / 1000;
      var secs = dif % 60;
      dif = (dif - secs) / 60;
      seconds1 = Math.abs(sec - secs)%60;
      if(sec - secs < 0)
      seconds1 = 60 - Math.abs(sec - secs)%60;
      if(once == 0 && seconds1 == 59)
        minutes1--, once = 1;
      if(seconds1 != 59)
        once = 0;
      this.setState({seconds1: seconds1});
      this.setState({minutes1: minutes1});
    }, 1000)
  }
  tickop(){
    this.startop = new Date().getTime()
    var min = this.state.minutes2;
    var minutes2 = min;
    var sec = this.state.seconds2;
    var once = 0;
    var seconds2;
    this.opInterval = 
    setInterval(() =>{
      this.timeop = new Date().getTime() + this.miliseconds;
      var dif = this.timeop - this.startop;
      var ms = dif % 1000;
      dif = (dif - ms) / 1000;
      var secs = dif % 60;
      dif = (dif - secs) / 60;
      seconds2 = Math.abs(sec - secs)%60;
      if(sec - secs < 0)
      seconds2 = 60 - Math.abs(sec - secs)%60;
      if(once == 0 && seconds2 == 59)
        minutes2--, once = 1;
      if(seconds2 != 59)
      once = 0;
      this.setState({seconds2: seconds2});
      this.setState({minutes2: minutes2});
      // if((this.timeop - this.startop) % 1000 == 0){
      //   var seconds2 = this.state.seconds2;
      //   this.setState({seconds2: seconds2 - 1});
      //   if(this.state.seconds2 == -1){
      //     var minutes2 = this.state.minutes2;
      //     this.setState({minutes2: minutes2 - 1});
      //     this.setState({seconds2: 59});
      //   }
      // }
    }, 1000)
  }
  // only allow pieces to be dragged when the board is oriented
  // in their direction
  // onDragStart = (source, piece, position, orientation) => {
  //   if (
  //     ((this.board.orientation() == 'black' && this.game.turn() == 'b') ||
  //     (this.board.orientation() == 'white' && this.game.turn() == 'w')) && 
  //     this.boards[this.specificMove] == this.game.fen() && this.state.end == false
  //   ) {
  //     console.log(this.game.fen());
  //     console.log(this.boards[this.specificMove]);
  //     // get list of possible moves for this square
  //     var moves = this.game.moves({
  //       square: source,
  //       verbose: true
  //     });

  //     // exit if there are no moves available for this square
  //     if (moves.length === 0) return;

  //     // highlight the square they moused over
  //     this.greySquare(source);
  //     // highlight the possible squares for this piece
  //     for (var i = 0; i < moves.length; i++) {
  //       this.greySquare(moves[i].to);
  //     }
  //   } else {
  //     console.log(this.game.fen());
  //     console.log(this.boards[this.specificMove]);
  //     return false;
  //   }
  // };
  tableHistory(event){
    var index = event.target.getAttribute('whichMove');
    var move = this.state.moves[index];
    this.setState({position: this.boards[move]});
    this.specificMove = move;
  }
  // removeGreySquares = () => {
  //   $('#myBoard .square-55d63').css('background', '');
  // };

  onDrop = (move) => {
    if(this.game.turn() == this.state.playerColor){
      // see if the move is legal
      var move = this.game.move({
        from: move.sourceSquare,
        to: move.targetSquare,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });
      // illegal move
      if (move === null){
        return;
      }
      console.log(this.game.turn())
      this.setState({position: this.game.fen()});
      // updateStatus()
      var moves1 = this.state.moves;
      var istorie = this.game.history();
      istorie[istorie.length - 1] += " ".repeat(5 - istorie[istorie.length - 1].length);
      moves1.push(istorie[istorie.length - 1]);
      this.setState({moves: moves1});
      this.specificMove = istorie[istorie.length - 1];
      this.boards[istorie[istorie.length - 1]] = this.game.fen();
      if(this.incrementOrder == true){
        this.nthmove++;
        var copy = this.state.order;
        copy.push(this.nthmove);
        this.setState({order: copy});
        this.incrementOrder = false;
      }else{
        this.incrementOrder = true;
      }
      this.socket.emit('mutarecod', window.location.search.substring(1));
      if(this.whattosend == true)
      this.socket.emit('timer', (this.timeop - this.startop) % 1000 );
      else
      this.socket.emit('timer', (this.timeme - this.startme) % 1000 );
      if(this.game.game_over() == true){
        this.setState({end: true});
      }
      this.socket.emit('mutare', {
        tabel: this.game.pgn(),
        mutari: this.state.moves,
        table: this.boards,
        end: this.state.end
      });
    }
  };

  // setHistory = history => {
  //   let ar = [];
  //   while (history.length > 0) ar.push(history.splice(0, 1));
  //   this.setState({
  //     history: ar
  //   });
  // };

  // greySquare = square => {
  //   var $square = $('#myBoard .square-' + square);

  //   var background = this.whiteSquareGrey;
  //   if ($square.hasClass('black-3c85d')) {
  //     background = this.blackSquareGrey;
  //   }

  //   $square.css('background', background);
  // };

  render() {
    const { minutes1, seconds1 } = this.state
    const { minutes2, seconds2 } = this.state
    if(seconds1 < 10){
      this.addZeroSeconds1 = true;
    }else{
      this.addZeroSeconds1 = false;
    }
    if(minutes1 < 10){
      this.addZeroMinutes1 = true;
    }else{
      this.addZeroMinutes1 = false;
    }
    if(seconds2 < 10){
      this.addZeroSeconds2 = true;
    }else{
      this.addZeroSeconds2 = false;
    }
    if(minutes2 < 10){
      this.addZeroMinutes2 = true;
    }else{
      this.addZeroMinutes2 = false;
    }
    var historyItemsOdd = [];
    var historyItemsEven = [];
    var orderMoves = [];
    for(var i = 0; i < this.state.moves.length; i = i + 1){
      if(i % 2 === 0){
        historyItemsOdd.push(<pre><button id = 'move' whichMove = {i} onClick={(event) => {this.tableHistory(event)}}>{this.state.moves[i]}</button></pre>);
      }
    }
    for(var i = 0; i < this.state.moves.length; i = i + 1){
      if(i % 2 === 1){
        historyItemsEven.push(<pre><button id = 'move' whichMove = {i} onClick={(event) => {this.tableHistory(event)}}>{this.state.moves[i]}</button></pre>);
      }
    }
    for(var i = 0; i < this.state.order.length; i = i + 1){
      orderMoves.push(<pre id = "numbers">{this.state.order[i]}</pre>)
    }
    return (
      <div>
        <div id = "timerme">
          {!this.addZeroMinutes1 && (<h1>{minutes1}:</h1>)}{this.addZeroMinutes1 && (<h1>0{minutes1}:</h1>)}{!this.addZeroSeconds1 && (<h1>{seconds1}</h1>)}{this.addZeroSeconds1 && (<h1>0{seconds1}</h1>)}
        </div>
        <div id = "timerop">
          {!this.addZeroMinutes2 && (<h1>{minutes2}:</h1>)}{this.addZeroMinutes2 && (<h1>0{minutes2}:</h1>)}{!this.addZeroSeconds2 && (<h1>{seconds2}</h1>)}{this.addZeroSeconds2 && (<h1>0{seconds2}</h1>)}
        </div>
        <div id="left-box">
          <div id = "chatdiv"></div>
          <input id = "chat" type = "text"></input>
          <button id = "draw">Draw</button>
          <button id = "resign">Resign</button>
          <div id = "infodiv"></div>
          <h2 id = "players"> User1 vs User2 </h2>
          <h2 id = "matchtime"> 30m</h2>
          <h2 id = "gametype"> Ranked </h2>
          <h2 id = "gamemode"> Blitz </h2>
        </div>
        {this.state.end && <div id = "gameEnd">
            <button id = "newGame"> New Game </button>
            <button id = "restart"> Restart</button>
        </div>}
        <div id="right-box">
          {!this.state.both && (
            <h2 id="waiting"></h2>
          )}
          {this.state.both && <h2 id="waiting2"></h2>}
          <h2 id="istoric">History</h2>
          <div id = "moveBox">
            <ol id = "historyOdd">
              {historyItemsOdd}
            </ol>
            <ol id = "historyEven">
              {historyItemsEven}
            </ol>
            <ol id = "historyOrder">
              {orderMoves}
            </ol>
          </div>
        </div>
        <div id = "myBoard">
        <Chessboard onDrop = {this.onDrop} width = {800} position={this.state.position} orientation = {this.state.orientation} />
        </div>
      </div>
    );
  }
}