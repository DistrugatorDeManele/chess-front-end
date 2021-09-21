import React from 'react';
import '../CSS/computersetup.css';
import Header from './Header.js';
import { Redirect } from 'react-router-dom';
export default class ComputerSetup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: ['randomColor', 'white', 'black'],
            redirect: false
        }
        console.log(window.connected);
        this.setColor = this.setColor.bind(this);
        this.defaultOtherTwo = this.defaultOtherTwo.bind(this);
        this.setTime = this.setTime.bind(this);
        this.enterGame = this.enterGame.bind(this);
        this.time = 10;
        this.color = 'r';
    }
    enterGame(){
        this.setState({redirect: true});
    }
    setColor(event){
        var id = event.target.id;
        var property = document.getElementById(id);
        property.style.backgroundColor = "#282424";
        this.defaultOtherTwo(id);
        //setting the color 
        if(id[0] == 'r'){
            this.color = 'r';
        }
        if(id[0] == 'w'){
            this.color = 'w';
        }
        if(id[0] == 'b'){
            this.color = 'b';
        }
    }
    defaultOtherTwo(id){
        if(id == this.state.id[0]){
            var property = document.getElementById(this.state.id[1]);
            property.style.backgroundColor = "gray";
            property = document.getElementById(this.state.id[2]);
            property.style.backgroundColor = "gray";
        }
        if(id == this.state.id[1]){
            var property = document.getElementById(this.state.id[0]);
            property.style.backgroundColor = "gray";
            property = document.getElementById(this.state.id[2]);
            property.style.backgroundColor = "gray";
        }
        if(id == this.state.id[2]){
            var property = document.getElementById(this.state.id[0]);
            property.style.backgroundColor = "gray";
            property = document.getElementById(this.state.id[1]);
            property.style.backgroundColor = "gray";
        }
    }
    setTime(){
        var options = document.getElementById("timeRange");
        console.log(options.options[options.selectedIndex].value[0]);
        var time = options.options[options.selectedIndex].value;
        //setting the time
        if(time[0] == '1'){
            if(time[1] == '0'){
                this.time = 10;
            }
            if(time[1] != '0'){
                this.time = 1;
            }
        }
        if(time[0] == '3'){
            this.time = 30;
        }
        if(time[0] == '5'){
            this.time = 5;
        }
    }
    render(){
        return(
            <div>
                {this.state.redirect && (
                <Redirect
                    to={{
                    pathname: '/computer',
                    search: this.state.link,
                    state: { fromDashboard: true }
                    }}
                />
                )}
                <Header></Header>
                <div>
                    <h2 id = "chooseTime">Choose your time</h2>
                    <select id = "timeRange" onChange = {this.setTime}>
                        <option>1m</option>
                        <option>5m</option>
                        <option>10m</option>
                        <option>30m</option>
                    </select>
                </div>
                <div>
                    <h2 id = "chooseColor">Color</h2>
                    <button class = "colorButton" id = "randomColor" onClick = {(event) => {this.setColor(event)}}>Random</button>
                    <button class = "colorButton" id = "white" onClick = {(event) => {this.setColor(event)}}>White</button>
                    <button class = "colorButton" id = "black" onClick = {(event) => {this.setColor(event)}}>Black</button>
                </div>
                <div>
                    <h2 id = "chooseDifficulty">Choose difficulty</h2>
                    <input min = "1" max = "20" id = "difficultyRange" type = "range"></input>
                </div>
                <div>
                    <button onClick = {this.enterGame} id = "playButton">Play</button>
                </div>
            </div>
        );
    }
}