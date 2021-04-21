import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';




function OrientationSwitch(props) {
    return (
        <Grid component="label" container alignItems="center" justify="center" spacing={1}>
            <Grid item><ListItemText primary="Vertical" /></Grid>
            <Grid item>
                <Switch
                    checked={props.state === "horiz"}
                    onChange={() => props.onClick()}
                    name="checkedC"
                />
            </Grid>
            <Grid item><ListItemText primary="Horizontal" /></Grid>
        </Grid>
    );
}

OrientationSwitch.propTypes = {
    state: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default OrientationSwitch;