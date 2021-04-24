import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import GenerationBoxes from 'components/settings/generations.js';
import OrientationSwitch from 'components/settings/orientationSwitch.js'

function SideBar(props) {
    const useStyles = makeStyles(() => ({
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
            classes={{root: classes.root}}
        >
            <GenerationBoxes 
                includeGens={props.gameSettings.includedGens}
                toggleGen={props.toggleGen}
            />
            <Divider variant="middle" />
            <ListItem>
                <OrientationSwitch
                    state={props.gameSettings.gameOrientation}
                    onClick={props.toggleOrientation}
                />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
                <TextField
                    variant="outlined"
                    label="Pokemon Sequence String"
                    size="small"
                    defaultValue={JSON.stringify(props.pkmOrder)}
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
                >New Game</Button>
            </ListItem>
            <ListItem>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={props.resetSettings}
                    classes={{root: classes.root}}
                >Reset Settings</Button>
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
                <a href="https://github.com/matthewkirby/pkm-battleship"><Link
                    component="button"
                    variant="h6"
                >GitHub</Link></a>
            </ListItem>

        </List>
    )
}

SideBar.propTypes = {
    toggleGen: PropTypes.func.isRequired,
    pkmOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
    importPkmOrder: PropTypes.func.isRequired,
    exportPkmOrder: PropTypes.func.isRequired,
    resetGame: PropTypes.func.isRequired,
    resetSettings: PropTypes.func.isRequired,
    toggleOrientation: PropTypes.func.isRequired,
    gameSettings: PropTypes.shape({
        gameOrientation: PropTypes.string.isRequired,
        includedGens: PropTypes.arrayOf(PropTypes.bool).isRequired
    })
}

export default SideBar;