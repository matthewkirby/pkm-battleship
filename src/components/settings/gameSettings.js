import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SideBar from 'components/settings/sidebar.js';

const CssTextField = withStyles({
    root: {
        '& .MuiInputBase-root': {
            color: 'white',
        },
        '& label.Mui-focused': {
            color: 'white',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        }
    },
})(TextField);

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
        offset: theme.mixins.toolbar
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
                    <Typography variant="h6" className="flex-grow">
                        Pokemon Battleship
                    </Typography>
                    <CssTextField
                        label="Search Pokemon"
                        size="small"
                        variant="outlined"
                        onChange={(event) => props.findPkmByName(event.target.value)}
                    />
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
                            resetSettings={props.resetSettings}
                            includedGens={props.includedGens}
                            toggleGen={props.toggleGen}
                            gameOrientation={props.gameOrientation}
                            toggleOrientation={props.toggleOrientation}
                        />
                    </SwipeableDrawer>
                </Toolbar>
            </AppBar>
            <div className={classes().offset} />
        </React.Fragment>
    );
}

ControlCenter.propTypes = {
    findPkmByName: PropTypes.func.isRequired,
    pkmOrder: PropTypes.string.isRequired,
    exportPkmOrder: PropTypes.func.isRequired,
    importPkmOrder: PropTypes.func.isRequired,
    resetGame: PropTypes.func.isRequired,
    resetSettings: PropTypes.func.isRequired,
    includedGens: PropTypes.arrayOf(PropTypes.bool).isRequired,
    toggleGen: PropTypes.func.isRequired,
    gameOrientation: PropTypes.string.isRequired,
    toggleOrientation: PropTypes.func.isRequired
}

export default ControlCenter