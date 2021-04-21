import PropTypes from 'prop-types';
import 'css/colorPicker.css';

function ColorSwatch(props) {
    const classList = ["picker-square", props.color+"-bgc"];
    if(props.selected) { classList.push("selected-color"); }
    return (
        <div
            className={classList.join(" ")} 
            onClick={props.onClick}
        />
    )
}

ColorSwatch.propTypes = {
    color: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}

function ColorPicker(props) {
    const colorList = ["r", "b", "g", "y", "p"]

    return (
        <div className="color-picker">
            {colorList.map(color => (
                <ColorSwatch
                    color={color}
                    onClick={() => props.onClick(color)}
                    key={color}
                    selected={props.rightClickColor===color ? true : false}
                />
            ))}
        </div>
    );
}

ColorPicker.propTypes = {
    onClick: PropTypes.func.isRequired,
    rightClickColor: PropTypes.string.isRequired
}

export default ColorPicker;