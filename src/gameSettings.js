import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
import ListSubheader from '@material-ui/core/ListSubheader'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'


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
            classes={{root: classes.root}}
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

export default ControlCenter