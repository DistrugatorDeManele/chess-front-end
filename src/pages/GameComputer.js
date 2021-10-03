import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import '../CSS/gamecomputer.css';
import StockFish from "./GameComputerStockfish.js";

class Demo extends Component {
  constructor(props){
    super(props);
    this.elo = this.props.elo;
  }
  render() {
    return (
      <div style={boardsContainer}>
        <StockFish>
          {({ position, onDrop }) => (
            <div id = "stockfish">
            <Chessboard
              id="stockfish"
              position={position}
              width={800}
              onDrop={onDrop}
              boardStyle={boardStyle}
              orientation="black"
            />
            </div>
          )}
        </StockFish>
      </div>
    );
  }
}

export default Demo;

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};
const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};
