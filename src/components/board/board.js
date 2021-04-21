import PropTypes from 'prop-types';
import Square from 'components/board/square.js';

function Board(props) {
    const board = []
    for(let i=0; i<props.pkmOrder.length; i++) {
        const key = props.pkmOrder[i] + 1;
        board.push(
            <Square
                id={key}
                status={props.boardState[i]}
                highlight={props.highlightMatches.includes(key)}
                onClick={() => props.onClick(props.boardNum, i)}
                onContextMenu={event => props.onContextMenu(event, props.boardNum, i)}
                key={key} 
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

Board.propTypes = {
    pkmOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
    boardState: PropTypes.arrayOf(PropTypes.string).isRequired,
    highlightMatches: PropTypes.array.isRequired,
    boardNum: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
    rowLen: PropTypes.number.isRequired
}

export default Board;