import React, { useState } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { ListItemIcon } from '@material-ui/core';

function GenerationBoxes(props) {
    const [genOpen, setGenOpen] = useState(false);

    const genList = [...Array(8).keys()];
    const supported = [true,true,true,false,false,false,false,false];    
    
    const elements = genList.map((gen) => {
        return (
            <ListItem
                key={gen}
                dense
                button
                disabled={!supported[gen]}
                onClick={() => props.toggleGen(gen)}
            >
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={props.includeGens[gen]}
                        name={"gen"+(gen+1)}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText primary={`Generation ${gen+1}`} />
            </ListItem>
        )
    });


    return (
        <React.Fragment>
            <ListItem button onClick={() => setGenOpen(!genOpen)}>
                <ListItemText primary={"Generations"} />
                {genOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={genOpen} timeout="auto" unmountOnExit>
                <List>
                    {elements}
                </List>
            </Collapse>
        </React.Fragment>
    )
}

GenerationBoxes.propTypes = {
    toggleGen: PropTypes.func.isRequired,
    includeGens: PropTypes.arrayOf(PropTypes.bool).isRequired,
};

export default GenerationBoxes;