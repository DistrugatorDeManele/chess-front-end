import React from 'react';
import '../CSS/onlinesetup.css';
import Header from './Header.js'
import { Redirect } from 'react-router-dom';
export default class ComputerSetup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: ['randomColor', 'white', 'black'],
            link: '',
            playerColor: 'da'
        }
        console.log(window.connected);
        this.socket = this.props.socket;
        //binding
        this.setColor = this.setColor.bind(this);
        this.defaultOtherTwo = this.defaultOtherTwo.bind(this);
        this.enterQueue = this.enterQueue.bind(this);
        this.setTime = this.setTime.bind(this);
        //the Time and the Color
        this.time = 1;
        this.color = 'r';
    }
    componentDidMount(){
        var property = document.getElementById("randomColor");
        property.style.backgroundColor = "#282424";
        this.socket.on('gasit', function(cod){
            this.setState({gasit: true, link: cod});
            console.log('am primit');
        }.bind(this)
        );
    }
    //Send to server to look for potential opponent
    enterQueue(){
        this.socket.emit('cautare', {color: this.color, time: this.time});
    }
    //function to set the chosen Time
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
    //function to set the chosen Color and coloring the clicked button
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
    //css:decoloring the other 2 buttons 
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
    render(){
        return(
            <div>
                <Header></Header>
                {this.state.gasit && (
                <Redirect
                    to={{
                    pathname: '/game',
                    search: this.state.link,
                    state: { playerColor: 'da' }
                    }}
                />
                )}
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
                    <button className = "colorButton" id = "randomColor" onClick = {(event) => {this.setColor(event)}}>Random</button>
                    <button className = "colorButton" id = "white" onClick = {(event) => {this.setColor(event)}}>White</button>
                    <button className = "colorButton" id = "black" onClick = {(event) => {this.setColor(event)}}>Black</button>
                </div>
                <div>
                    <button onClick = {this.enterQueue} id = "play">Play</button>
                </div>
            </div>
        );
    }
}