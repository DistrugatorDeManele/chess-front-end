import React from 'react';
import '../CSS/computersetup.css';
import Header from './Header.js'
export default class ComputerSetup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: ['randomColor', 'white', 'black']
        }
        console.log(window.connected);
        this.setColor = this.setColor.bind(this);
        this.defaultOtherTwo = this.defaultOtherTwo.bind(this);
    }
    setColor(event){
        var id = event.target.id;
        var property = document.getElementById(id);
        property.style.backgroundColor = "#282424";
        this.defaultOtherTwo(id);
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
    render(){
        return(
            <div>
                <Header></Header>
                <div>
                    <h2 id = "chooseTime">Choose your time</h2>
                    <select id = "timeRange">
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
            </div>
        );
    }
}