import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import lookup from './data/sprite_lookup.json'
import nameList from './data/names_en.json'
import ControlCenter from './gameSettings.js'


function Square(props) {
    const position = lookup[props.id];
    const xpos = -position['x'] * 50 / 64;
    const ypos = -position['y'] * 50 / 64;
    const imageStyle = { "backgroundPosition": xpos + 'px ' + ypos + 'px' };
    
    const bgColors = {"-1": "red", 0: "white", 1: "darkgrey", 2: "blue"};
    const highlight = props.highlight ? "selection" : "";
    return (
        <button
            style={imageStyle}
            className={`square ${bgColors[props.status]} ${highlight}`} 
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
        />
    );
}


function Board(props) {
    const board = []
    for(let i=0; i<props.pkmOrder.length; i++) {
        const key = props.pkmOrder[i] + 1;
        board.push(
            <Square
                id={key}
                status={props.boardState[i]}
                highlight={props.highlightMatches.includes(key)}
                onClick={() => props.onClick(props.boardNum, i)}
                onContextMenu={event => props.onContextMenu(event, props.boardNum, i)}
                key={key} 
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
    const [maxRows, setMaxRows] = useState(11);
    const [includedGens, setIncludedGens] = useState([true, false, false, false, false, false, false, false])
    const genTable = {
        0: [...Array(151).keys()],
        1: [...Array(100).keys()].map((val) => { return val+151; }),
        2: [...Array(135).keys()].map((val) => { return val+251; })
    }

    const [pkmOrder, setPkmOrder] = useState(shuffleBoard());
    const [boardState, setBoardState] = useState([Array(maxRows*rowLen).fill(0), Array(maxRows*rowLen).fill(0)]);
    const [highlightMatches, setHighlightMatches] = useState([]);

    function shuffleBoard() {
        let tmpPkmOrder = [];
        for(let i=0; i<8; i++) {
            if(includedGens[i]) {
                tmpPkmOrder = tmpPkmOrder.concat(genTable[i])
            }
        }

        let shuffledOrder = tmpPkmOrder.sort(() => Math.random() - 0.5);
        if(shuffledOrder.length > rowLen*maxRows) {
            shuffledOrder = shuffledOrder.slice(0, rowLen*maxRows);
        }
        return shuffledOrder
    }

    // Grab the locally stored values
    React.useEffect(() => {
        setRowLen(Number(localStorage.getItem("rowLen") || 14));
        setMaxRows(Number(localStorage.getItem("maxRows") || 11));
        const savedPkmOrder = JSON.parse(localStorage.getItem("pkmOrder"));
        if(savedPkmOrder !== null) { setPkmOrder(savedPkmOrder); }
        const savedBoardState = JSON.parse(localStorage.getItem("boardState"));
        if(savedBoardState !== null) { setBoardState(savedBoardState); }
        const savedIncludedGens = JSON.parse(localStorage.getItem("includedGens"));
        if(savedIncludedGens !== null) { setIncludedGens(savedIncludedGens); }
    }, []);

    // Save state to localstorage
    React.useEffect(() => {
        localStorage.setItem("rowLen", rowLen);
        localStorage.setItem("maxRows", maxRows);
        localStorage.setItem("pkmOrder", JSON.stringify(pkmOrder));
        localStorage.setItem("boardState", JSON.stringify(boardState));
        localStorage.setItem("includedGens", JSON.stringify(includedGens));
    }, [rowLen, maxRows, pkmOrder, boardState, includedGens]);

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
        setPkmOrder(shuffleBoard());
        setBoardState([Array(maxRows*rowLen).fill(0), Array(maxRows*rowLen).fill(0)]);
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

    function toggleGen(gen) {
        let newIncludedGens = includedGens.slice()
        newIncludedGens[gen] = !newIncludedGens[gen];
        setIncludedGens(newIncludedGens);
    }

    function findPkmByName(inputString) {
        let pkmMatchList = [];
        if(inputString !== "") {
            const cappedSting = inputString.charAt(0).toUpperCase() + inputString.slice(1);
            const matchList = nameList.filter(element => element.startsWith(cappedSting));
            pkmMatchList = matchList.map(name => nameList.indexOf(name)+1);
        }
        setHighlightMatches(pkmMatchList);
    }

    return (
        <React.Fragment>
            <ControlCenter
                pkmOrder={JSON.stringify(pkmOrder)}
                resetGame={resetGame}
                exportPkmOrder={exportPkmOrder}
                importPkmOrder={importPkmOrder}
                includedGens={includedGens}
                toggleGen={toggleGen}
                findPkmByName={findPkmByName}
            />
            <div className="game">
                <Board
                    boardNum={0}
                    rowLen={rowLen}
                    pkmOrder={pkmOrder}
                    boardState={boardState[0]}
                    highlightMatches={highlightMatches}
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}
                />
                <span className="board-gap" />
                <Board
                    boardNum={1}
                    rowLen={rowLen}
                    pkmOrder={pkmOrder}
                    boardState={boardState[1]}
                    highlightMatches={highlightMatches}
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