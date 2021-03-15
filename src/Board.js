import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import './Board.css';

import Square from './Square';

function Board(props) {
  const { socket, perm } = props;
  const p = perm;
  const sock = socket;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [user, setUser] = useState(1);

  function getValue(usr) {
    if (usr === 2) {
      return 'O';
    } if (usr === 1) {
      return 'X';
    }
    return ' ';
  }

  function changeUser(usr) {
    if (usr === 1) {
      setUser(2);
    } else if (usr === 2) {
      setUser(1);
    }
  }

  function calculateWinner() {
    const winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningMoves.length; i += 1) {
      const [a, b, c] = winningMoves[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [board[a], winningMoves[i]];
      }
    }

    return [null, null];
  }

  function moveWinner(boardCopy) {
    const winningMoves = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningMoves.length; i += 1) {
      const [a, b, c] = winningMoves[i];
      if (
        boardCopy[a]
        && boardCopy[a] === boardCopy[b]
        && boardCopy[a] === boardCopy[c]
      ) {
        return [boardCopy[a], winningMoves[i]];
      }
    }

    return [null, null];
  }

  function calculateTie() {
    const winner = calculateWinner()[0];
    if (!board.includes(null) && winner === null) {
      return true;
    }
    return false;
  }

  function moveTie(boardCopy) {
    const winner = moveWinner(boardCopy)[0];
    if (!boardCopy.includes(null) && winner === null) {
      return true;
    }
    return false;
  }

  function onClickSquare(idx) {
    if (p === 'S') {
      return;
    }

    if (p !== getValue(user)) {
      return;
    }

    const winner = calculateWinner()[0];

    if (board[idx] || winner !== null) {
      return;
    }
    const boardCopy = board.slice();
    boardCopy[idx] = getValue(user);

    const mw = moveWinner(boardCopy)[0];
    const tie2 = moveTie(boardCopy);

    if (mw) {
      // console.log('Sending WINNER match emit', board);
      sock.emit('match', [mw, perm]);
    } else if (tie2) {
      // console.log('Sending TIE match emit', board);
      sock.emit('match', ['Tie', perm]);
    }

    changeUser(user);
    setBoard(boardCopy);

    const userCopy = user;
    sock.emit('board', { board: boardCopy, user: userCopy });
  }

  function renderSquare(i) {
    return (
      <Square index={i} value={board[i]} onClick={() => onClickSquare(i)} />
    );
  }

  function onClickPlayAgain() {
    setBoard(Array(9).fill(null));
    setUser(1);
    sock.emit('reset');
  }

  useEffect(() => {
    sock.on('board', (data) => {
      // console.log('Board event received!');
      // console.log(data);

      setBoard(data.board);
      changeUser(data.user);
    });

    sock.on('reset', () => {
      // console.log('Reset event received!');
      setBoard(Array(9).fill(null));
      setUser(1);
    });
  }, []);

  const winner = calculateWinner()[0];
  const tie = calculateTie();

  // console.log('Update status');
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (tie) {
    status = 'Tie!!';
  } else {
    status = `Next player: ${getValue(user)}`;
  }

  return (
    <div>
      <player>
        {' '}
        {status}
        {' '}
      </player>
      <div className="board">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <br />
      {winner || tie ? (
        <button type="submit" onClick={onClickPlayAgain}> Play Again </button>
      ) : null}
    </div>
  );
}

Board.propTypes = {
  socket: PropTypes.instanceOf(io()),
  perm: PropTypes.string,
};

Board.defaultProps = {
  socket: io(),
  perm: 'S',
};

export default Board;
