import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import seedrandom from "seedrandom";

import lookup from './data/sprite_lookup.json'


function Square(props) {
    const position = lookup[props.id];
    const xpos = -position['x'] * 50 / 64;
    const ypos = -position['y'] * 50 / 64;
    const imageStyle = { "backgroundPosition": xpos + 'px ' + ypos + 'px' };
    
    const bgColors = {"-1": "red", 0: "white", 1: "darkgrey", 2: "blue"};
    return (
        <button
            style={imageStyle}
            className={`square ${bgColors[props.status]}`} 
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
        />
    );
}


function Board(props) {
    const [boardState, setBoardState] = useState(Array(props.pkmOrder.length).fill(0));

    function handleClick(i) {
        const newBoardState = boardState.slice();
        const curVal = newBoardState[i];
        newBoardState[i] = curVal === 2 ? curVal : curVal+1;
        setBoardState(newBoardState);
    }

    function handleContextMenu(event, i) {
        event.preventDefault();
        const newBoardState = boardState.slice();
        const curVal = newBoardState[i];
        newBoardState[i] = curVal === -1 ? curVal : curVal-1;
        setBoardState(newBoardState);
    }
  
    const board = []
    for(let i=0; i<props.pkmOrder.length; i++) {
        board.push(
            <Square
                id={props.pkmOrder[i] + 1}
                status={boardState[i]}
                onClick={() => handleClick(i)}
                onContextMenu={event => handleContextMenu(event, i)}
                key={props.pkmOrder[i] + 1} 
            />
        )
    }

    const boardStyle = { "gridTemplateColumns": 'repeat(' + props.rowLen + ', 49px)' };
    return (
        <div className="game-board" style={boardStyle}>
            {board}
        </div>
    );
}


function Game(props) {
    const [rowLen, setRowLen] = useState(14);
    const [seed, setSeed] = useState(Math.floor(Math.random()*100000000));

    const rng = seedrandom(seed);
    let tmpPkmOrder = [...Array(151).keys()];
    const [pkmOrder, setPkmOrder] = useState(tmpPkmOrder.sort(() => rng() - 0.5))

    return (
        <div className="game">
            Current Seed: {seed}
            <Board
                boardNum={1}
                rowLen={rowLen}
                pkmOrder={pkmOrder} 
            />
        </div>
    );
}





// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);