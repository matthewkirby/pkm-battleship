import React, { useState } from 'react';
import 'css/index.css';
import 'css/colors.css';
import nameList from 'data/names_en.json';
import Board from 'components/board/board.js';
import ControlCenter from 'components/settings/gameSettings.js';
import ColorPicker from 'components/colorPicker/colorPicker.js';

const DEFAULT_STATE = {
    rowLen: 14,
    maxRows: 11,
    gameOrientation: "vert",
    includedGens: [true, false, false, false, false, false, false, false],
    highlightMatches: [],
    rightClickColor: "r"
}

function Game() {
    const [gameSettings, setGameSettings] = useState(DEFAULT_STATE);

    const genTable = {
        0: [...Array(151).keys()],
        1: [...Array(100).keys()].map((val) => { return val+151; }),
        2: [...Array(135).keys()].map((val) => { return val+251; })
    }

    const [pkmOrder, setPkmOrder] = useState(shuffleBoard(gameSettings.includedGens));
    // const [boardState, setBoardState] = useState([Array(maxRows*rowLen).fill("w"), Array(maxRows*rowLen).fill("w")]);
    const [boardState, setBoardState] = useState([Array(pkmOrder.length).fill("w"), Array(pkmOrder.length).fill("w")]);

    function shuffleBoard(tempIncludedGens) {
        let tmpPkmOrder = [];
        for(let i=0; i<8; i++) {
            if(tempIncludedGens[i]) {
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
        const savedGameSettings = JSON.parse(localStorage.getItem("gameSettings"));
        if(savedGameSettings !== null) { setGameSettings(savedGameSettings); }
        else { setGameSettings(DEFAULT_STATE); }
        const savedPkmOrder = JSON.parse(localStorage.getItem("pkmOrder"));
        if(savedPkmOrder !== null) { setPkmOrder(savedPkmOrder); }
        const savedBoardState = JSON.parse(localStorage.getItem("boardState"));
        if(savedBoardState !== null) { setBoardState(savedBoardState); }
    }, []);

    // Save state to localstorage
    React.useEffect(() => {
        localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
        localStorage.setItem("pkmOrder", JSON.stringify(pkmOrder));
        localStorage.setItem("boardState", JSON.stringify(boardState));
    }, [gameSettings, pkmOrder, boardState]);

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
        newBoardState[boardNum][i] = curVal === gameSettings.rightClickColor ? "w" : gameSettings.rightClickColor;
        setBoardState(newBoardState);
    }

    function resetGame(_, tempIncludedGens=gameSettings.includedGens) {
        const tempPkmOrder = shuffleBoard(tempIncludedGens);
        setPkmOrder(tempPkmOrder);
        // setBoardState([Array(maxRows*rowLen).fill("w"), Array(maxRows*rowLen).fill("w")]);
        setBoardState([Array(tempPkmOrder.length).fill("w"), Array(tempPkmOrder.length).fill("w")]);
    }

    const resetSettings = () => {
        setGameSettings(DEFAULT_STATE);
        resetGame(null, DEFAULT_STATE.includedGens);
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
        let newIncludedGens = gameSettings.includedGens.slice()
        newIncludedGens[gen] = !newIncludedGens[gen];
        setGameSettings({...gameSettings, includedGens: newIncludedGens});
    }

    function setRightClickColor(color) {
        setGameSettings({...gameSettings, rightClickColor: color});
    }

    function findPkmByName(inputString) {
        let pkmMatchList = [];
        if(inputString !== "") {
            const cappedSting = inputString.charAt(0).toUpperCase() + inputString.slice(1);
            const matchList = nameList.filter(element => element.startsWith(cappedSting));
            pkmMatchList = matchList.map(name => nameList.indexOf(name)+1);
        }
        setGameSettings({...gameSettings, highlightMatches: pkmMatchList});
    }

    function toggleOrientation() {
        const newGameOrientation = gameSettings.gameOrientation === "vert" ? "horiz" : "vert";
        setGameSettings({...gameSettings, gameOrientation: newGameOrientation})
    }

    return (
        <React.Fragment>
            <ControlCenter
                pkmOrder={pkmOrder}
                gameSettings={gameSettings}
                resetGame={resetGame}
                resetSettings={resetSettings}
                exportPkmOrder={exportPkmOrder}
                importPkmOrder={importPkmOrder}
                toggleGen={toggleGen}
                findPkmByName={findPkmByName}
                toggleOrientation={toggleOrientation}
            />
            <div className={"game-"+gameSettings.gameOrientation}>
                <Board
                    boardNum={0}
                    gameSettings={gameSettings}
                    pkmOrder={pkmOrder}
                    boardState={boardState[0]}
                    onClick={handlePkmClick}
                    onContextMenu={handlePkmContextMenu}
                />
                <Board
                    boardNum={1}
                    gameSettings={gameSettings}
                    pkmOrder={pkmOrder}
                    boardState={boardState[1]}
                    onClick={handlePkmClick}
                    onContextMenu={handlePkmContextMenu}
                />
            </div>
            <ColorPicker
                rightClickColor={gameSettings.rightClickColor}
                onClick={setRightClickColor}
            />
        </React.Fragment>
    );
}

export default Game;