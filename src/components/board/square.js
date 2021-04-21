import lookup from 'data/sprite_lookup.json';

function Square(props) {
    const position = lookup[props.id];
    const xpos = -position['x'] * 50 / 64;
    const ypos = -position['y'] * 50 / 64;
    const imageStyle = { "backgroundPosition": xpos + 'px ' + ypos + 'px' };
    
    const highlight = props.highlight ? "selection" : "";
    return (
        <button
            style={imageStyle}
            className={`square ${props.status+"-bgc"} ${highlight}`} 
            onClick={props.onClick}
            onContextMenu={props.onContextMenu}
        />
    );
}

export default Square;