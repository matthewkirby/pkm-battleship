import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import seedrandom from "seedrandom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import 'fontsource-roboto'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link'
import Divider from '@material-ui/core/Divider'


import lookup from './data/sprite_lookup.json'
import { ListSubheader, SwipeableDrawer } from '@material-ui/core';
import { findByLabelText } from '@testing-library/dom';


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


function SideBar(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            maxWidth: 360,
        },
        subheader: {
            textAlign: 'left',
            fontSize: "20px",
        }
    }));
    const classes = useStyles();

    return (
        <List
            subheader={<ListSubheader classes={{root: classes.subheader}}>Options</ListSubheader>}
            classes={classes.root}
        >
            <ListItem>
                <TextField
                    variant="outlined"
                    label="Pokemon Sequence String"
                    size="small"
                    defaultValue={props.pkmOrder}
                    classes={{root: classes.root}}
                    id="sequence-string"
                />
            </ListItem>
            <ListItem>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={props.importPkmOrder}
                    classes={{root: classes.root}}
                >Import Pokemon Sequence</Button>
            </ListItem>
            <ListItem>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={props.exportPkmOrder}
                    classes={{root: classes.root}}
                >Export Pokemon Sequence</Button>
            </ListItem>
            <ListItem>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={props.resetGame}
                    classes={{root: classes.root}}
                >Reset Game</Button>
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
                <Link
                    component="button"
                    variant="h6"
                >GitHub</Link>
            </ListItem>

        </List>
    )
}


function ControlCenter(props) {
    const [anchorState, setAnchorState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setAnchorState(open);
    };

    // Fix for fixed position toolbar and overlapping elements
    const classes = makeStyles(theme => ({
        offset: theme.mixins.toolbar,
    }))

    return (
        <React.Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Pokemon Battleship
                    </Typography>
                    <SwipeableDrawer
                        anchor="left"
                        open={anchorState}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >
                        <SideBar
                            pkmOrder={props.pkmOrder}
                            exportPkmOrder={props.exportPkmOrder}
                            importPkmOrder={props.importPkmOrder}
                            resetGame={props.resetGame}
                        />
                    </SwipeableDrawer>
                </Toolbar>
            </AppBar>
            <div className={classes().offset} />
        </React.Fragment>
    );
}


function Game(props) {
    const [rowLen, setRowLen] = useState(14);
    const [seed, setSeed] = useState(Math.floor(Math.random()*100000000));

    const npkm = 151;
    const [pkmOrder, setPkmOrder] = useState(shuffleBoard(npkm, seed));
    const [boardState, setBoardState] = useState([Array(npkm).fill(0), Array(npkm).fill(0)]);

    function shuffleBoard(npkm, seed) {
        const rng = seedrandom(seed);
        let tmpPkmOrder = [...Array(npkm).keys()];
        return tmpPkmOrder.sort(() => rng() - 0.5);
    }

    // Grab the locally stored values
    React.useEffect(() => {
        setRowLen(Number(localStorage.getItem("rowLen") || 14));
        const newSeed = Number(localStorage.getItem("seed"));
        if(newSeed !== null) { setSeed(newSeed); }
        const savedPkmOrder = JSON.parse(localStorage.getItem("pkmOrder"));
        if(savedPkmOrder !== null) { setPkmOrder(savedPkmOrder); }
        const savedBoardState = JSON.parse(localStorage.getItem("boardState"));
        if(savedBoardState !== null) { setBoardState(savedBoardState); }
    }, []);

    // Save state to localstorage
    React.useEffect(() => {
        localStorage.setItem("rowLen", rowLen);
        localStorage.setItem("seed", seed);
        localStorage.setItem("pkmOrder", JSON.stringify(pkmOrder))
        localStorage.setItem("boardState", JSON.stringify(boardState))
    }, [rowLen, seed, pkmOrder, boardState]);

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
        setSeed(Math.floor(Math.random()*100000000));
        setPkmOrder(shuffleBoard(npkm, seed));
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
                seed={seed}
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