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


export default ColorPicker;