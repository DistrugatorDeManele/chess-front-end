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
      minutes1: 1,
      seconds1: 0,
      minutes2: 1,
      seconds2: 0,
      moves: [],
      order: [],
      end: false,
      position: "start",
      orientation: '',
      playerColor: 'w',
      surplusBlack: 0,
      surplusWhite: 0
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
    this.transform_time = this.transform_time.bind(this);
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
    this.unixtime = 0;
    this.BlackMiliseconds;
    this.WhiteMiliseconds;
    this.whoSent = 'a';
    this.delay;
    this.socket.on(
      'link',
      function(game) {
        if(game.youAre == 'p1'){
          console.log('sunt p1');
          this.setState({orientation: game.player1});
          this.setState({playerColor: game.player1[0]});
          this.setState({minutes1: game.time});
        }
        if(game.youAre == 'p2'){
          console.log('sunt p2');
          this.setState({orientation: game.player2});
          this.setState({playerColor: game.player2[0]});
        }
        if(game.refresh == 'true'){
        this.BlackMiliseconds = game.blackTimeMs;
        this.WhiteMiliseconds = game.whiteTimeMs;
        this.transform_time();
        this.game.load_pgn(game.room.tabel);//1
        this.setState({position: this.game.fen()});
        var mutari = game.room.mutari;//2
        this.boards = game.room.table;//3
        this.setState({moves: mutari});
        this.specificMove = game.room.mutari[mutari.length - 1];
        if(game.room.end == true){//4
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
        }else{
          this.setState({minutes1: game.time});
          this.setState({minutes2: game.time});
        }
      }.bind(this)
    );
  }
  componentDidMount() {
    this.socket.on('timer', function(timpii) {
      this.BlackMiliseconds = timpii.blackTimeMs;
      this.WhiteMiliseconds = timpii.whiteTimeMs;
      this.whoSent = timpii.color;
      this.delay = timpii.delay;
      this.transform_time();
    }.bind(this)
    );
    this.socket.on('mutare',
      function(move) {
        this.game.load_pgn(move.information.tabel);//1
        this.setState({position: this.game.fen()});
        var mutari = move.information.mutari;//2
        this.boards = move.information.table;//3
        this.setState({moves: mutari});
        this.specificMove = move.information.mutari[mutari.length - 1];
        if(move.information.end == true){//4
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
}
  transform_time() {
    console.log(this.WhiteMiliseconds);
    console.log(this.BlackMiliseconds);
    if(this.state.playerColor == 'w'){
      this.setState({minutes1: Math.trunc(this.WhiteMiliseconds/60000)});
      this.setState({seconds1: Math.trunc((this.WhiteMiliseconds%60000)/1000)});
      this.setState({minutes2: Math.trunc(this.BlackMiliseconds/60000)});
      this.setState({seconds2: Math.trunc((this.BlackMiliseconds%60000)/1000)});
      var LeftWhite = this.WhiteMiliseconds%1000;
      var LeftBlack = this.BlackMiliseconds%1000;
      console.log(this.whoSent);
      if(this.game.turn() == this.state.playerColor){
        this.tickme();
        this.stopop();
        this.miliseconds = LeftWhite+100;
        console.log('1');
        console.log(this.state.playerColor);
      }else{
        this.tickop();
        this.stopme();
        this.miliseconds = LeftBlack+100;
        console.log('2');
        console.log(this.state.playerColor);
      }
    }else{      
      this.setState({minutes1: Math.trunc(this.BlackMiliseconds/60000)});
      this.setState({seconds1: Math.trunc((this.BlackMiliseconds%60000)/1000)});
      this.setState({minutes2: Math.trunc(this.WhiteMiliseconds/60000)});
      this.setState({seconds2: Math.trunc((this.WhiteMiliseconds%60000)/1000)});
      var LeftWhite = this.WhiteMiliseconds%1000;
      var LeftBlack = this.BlackMiliseconds%1000;
      if(this.game.turn() == this.state.playerColor){
        this.stopop();
        this.tickme();
        this.miliseconds = LeftBlack+100;
        console.log('3')
        console.log(this.state.playerColor);
      }else{
        this.stopme();
        this.tickop();
        this.miliseconds = LeftWhite+100;
        console.log('4');
        console.log(this.state.playerColor);
      }
    }
  }
  stopme() {
  if(this.myInterval != null){
  clearInterval(this.myInterval);
  console.log('am oprit oponentul');
  }
}
  stopop(){
  if(this.opInterval != null){
  clearInterval(this.opInterval);
  console.log('am oprit oponentul');
  }
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
    }, 100)
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
    }, 100)
  }
  tableHistory(event){
    var index = event.target.getAttribute('whichmove');
    var move = this.state.moves[index];
    this.setState({position: this.boards[move]});
    this.specificMove = move;
  }

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
      this.unixtime = Date.now();
      var delay = Date.now();
      if(this.whattosend == true){
      this.setState({position: this.game.fen()});
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
      if(this.game.game_over() == true){
        this.setState({end: true});
      }
      this.socket.emit('mutare', {
        link: window.location.search.substring(1),
        tabel: this.game.pgn(),
        mutari: this.state.moves,
        table: this.boards,
        end: this.state.end,
        color: this.state.playerColor
      });
      this.socket.emit('timer', {
        link: window.location.search.substring(1),
        timp: this.unixtime,
        color: this.state.playerColor,
        delay: Date.now() - this.unixtime
      });
    }
    };
  }
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
        historyItemsOdd.push(<pre key = {i}><button id = 'move' whichmove = {i} onClick={(event) => {this.tableHistory(event)}}>{this.state.moves[i]}</button></pre>);
      }
    }
    for(var i = 0; i < this.state.moves.length; i = i + 1){
      if(i % 2 === 1){
        historyItemsEven.push(<pre key = {i}><button id = 'move' whichmove = {i} onClick={(event) => {this.tableHistory(event)}}>{this.state.moves[i]}</button></pre>);
      }
    }
    for(var i = 0; i < this.state.order.length; i = i + 1){
      orderMoves.push(<pre key = {i}  id = "numbers">{this.state.order[i]}</pre>)
    }
    return (
      <div>
        <div id = "timerme">
          {!this.addZeroMinutes1 && (<h1>{minutes1}:</h1>)}{this.addZeroMinutes1 && (<h1>0{minutes1}:</h1>)}
          {!this.addZeroSeconds1 && (<h1>{seconds1}</h1>)}{this.addZeroSeconds1 && (<h1>0{seconds1}</h1>)}
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