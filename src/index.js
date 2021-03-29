import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fontsource-roboto'
import lookup from './data/sprite_lookup.json'
import ControlCenter from './gameSettings.js'


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
    const board = []
    for(let i=0; i<props.pkmOrder.length; i++) {
        board.push(
            <Square
                id={props.pkmOrder[i] + 1}
                status={props.boardState[i]}
                onClick={() => props.onClick(props.boardNum, i)}
                onContextMenu={event => props.onContextMenu(event, props.boardNum, i)}
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

    const npkm = 151;
    const [pkmOrder, setPkmOrder] = useState(shuffleBoard(npkm));
    const [boardState, setBoardState] = useState([Array(npkm).fill(0), Array(npkm).fill(0)]);

    // function shuffleBoard(npkm, seed) {
    function shuffleBoard(npkm) {
        const rng = Math.random;
        let tmpPkmOrder = [...Array(npkm).keys()];
        return tmpPkmOrder.sort(() => rng() - 0.5);
    }

    // Grab the locally stored values
    React.useEffect(() => {
        setRowLen(Number(localStorage.getItem("rowLen") || 14));
        const savedPkmOrder = JSON.parse(localStorage.getItem("pkmOrder"));
        if(savedPkmOrder !== null) { setPkmOrder(savedPkmOrder); }
        const savedBoardState = JSON.parse(localStorage.getItem("boardState"));
        if(savedBoardState !== null) { setBoardState(savedBoardState); }
    }, []);

    // Save state to localstorage
    React.useEffect(() => {
        localStorage.setItem("rowLen", rowLen);
        localStorage.setItem("pkmOrder", JSON.stringify(pkmOrder))
        localStorage.setItem("boardState", JSON.stringify(boardState))
    }, [rowLen, pkmOrder, boardState]);

    function handleClick(boardNum, i) {
        const newBoardState = boardState.slice();
        const curVal = newBoardState[boardNum][i];
        newBoardState[boardNum][i] = curVal === 2 ? curVal : curVal+1;
        setBoardState(newBoardState);
    }

    function handleContextMenu(event, boardNum, i) {
        event.preventDefault();
        const newBoardState = boardState.slice();
        const curVal = newBoardState[boardNum][i];
        newBoardState[boardNum][i] = curVal === -1 ? curVal : curVal-1;
        setBoardState(newBoardState);
    }

    function resetGame() {
        setPkmOrder(shuffleBoard(npkm));
        setBoardState([Array(npkm).fill(0), Array(npkm).fill(0)]);
    }

    function exportPkmOrder() {
        const textbox = document.getElementById("sequence-string");
        textbox.select();
        document.execCommand("copy");
    }

    function importPkmOrder() {
        const newPkmOrder = document.getElementById("sequence-string").value;
        setPkmOrder(JSON.parse(newPkmOrder));
    }


    return (
        <React.Fragment>
            <ControlCenter
                pkmOrder={JSON.stringify(pkmOrder)}
                resetGame={resetGame}
                exportPkmOrder={exportPkmOrder}
                importPkmOrder={importPkmOrder}
            />
            <div className="game">
                <Board
                    boardNum={0}
                    rowLen={rowLen}
                    pkmOrder={pkmOrder}
                    boardState={boardState[0]}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                />
                <span className="board-gap" />
                <Board
                    boardNum={1}
                    rowLen={rowLen}
                    pkmOrder={pkmOrder}
                    boardState={boardState[1]}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                />
            </div>
        </React.Fragment>
    );
}


// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);