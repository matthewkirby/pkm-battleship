import React, { useState } from 'react';
import 'css/index.css';
import 'css/colors.css';
import nameList from 'data/names_en.json';
import Board from 'components/board/board.js';
import ControlCenter from 'components/settings/gameSettings.js';
import ColorPicker from 'components/colorPicker/colorPicker.js';

function Game() {
    const [rowLen, setRowLen] = useState(14);
    const [maxRows, setMaxRows] = useState(11);
    const [includedGens, setIncludedGens] = useState([true, false, false, false, false, false, false, false])
    const genTable = {
        0: [...Array(151).keys()],
        1: [...Array(100).keys()].map((val) => { return val+151; }),
        2: [...Array(135).keys()].map((val) => { return val+251; })
    }

    const [pkmOrder, setPkmOrder] = useState(shuffleBoard());
    const [boardState, setBoardState] = useState([Array(maxRows*rowLen).fill("w"), Array(maxRows*rowLen).fill("w")]);
    const [highlightMatches, setHighlightMatches] = useState([]);
    const [rightClickColor, setRightClickColor] = useState("r");

    function shuffleBoard() {
        let tmpPkmOrder = [];
        for(let i=0; i<8; i++) {
            if(includedGens[i]) {
                tmpPkmOrder = tmpPkmOrder.concat(genTable[i])
            }
        }

        let currentIndex = tmpPkmOrder.length, tempValue, randomIndex;
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            tempValue = tmpPkmOrder[currentIndex];
            tmpPkmOrder[currentIndex] = tmpPkmOrder[randomIndex];
            tmpPkmOrder[randomIndex] = tempValue;
        }

        return tmpPkmOrder
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
        setRightClickColor(localStorage.getItem("rightClickColor") || "r")
    }, []);

    // Save state to localstorage
    React.useEffect(() => {
        localStorage.setItem("rowLen", rowLen);
        localStorage.setItem("maxRows", maxRows);
        localStorage.setItem("pkmOrder", JSON.stringify(pkmOrder));
        localStorage.setItem("boardState", JSON.stringify(boardState));
        localStorage.setItem("includedGens", JSON.stringify(includedGens));
        localStorage.setItem("rightClickColor", rightClickColor)
    }, [rowLen, maxRows, pkmOrder, boardState, includedGens, rightClickColor]);

    function handlePkmClick(boardNum, i) {
        const newBoardState = boardState.slice();
        const curVal = newBoardState[boardNum][i];
        newBoardState[boardNum][i] = curVal === "k" ? "w" : "k";
        setBoardState(newBoardState);
    }

    function handlePkmContextMenu(event, boardNum, i) {
        event.preventDefault();
        const newBoardState = boardState.slice();
        const curVal = newBoardState[boardNum][i];
        newBoardState[boardNum][i] = curVal === rightClickColor ? "w" : rightClickColor;
        setBoardState(newBoardState);
    }

    function resetGame() {
        setPkmOrder(shuffleBoard());
        setBoardState([Array(maxRows*rowLen).fill("w"), Array(maxRows*rowLen).fill("w")]);
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
                    onClick={handlePkmClick}
                    onContextMenu={handlePkmContextMenu}
                />
                <span className="board-gap" />
                <Board
                    boardNum={1}
                    rowLen={rowLen}
                    pkmOrder={pkmOrder}
                    boardState={boardState[1]}
                    highlightMatches={highlightMatches}
                    onClick={handlePkmClick}
                    onContextMenu={handlePkmContextMenu}
                />
                <span className="board-gap" />
                <ColorPicker
                    rightClickColor={rightClickColor}
                    onClick={setRightClickColor}
                />
            </div>
        </React.Fragment>
    );
}

export default Game;