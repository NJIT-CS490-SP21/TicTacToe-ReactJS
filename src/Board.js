import { useState, useRef, useEffect } from 'react';
import './Board.css';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

export function Board(){
    const [board,setBoard] = useState( Array(9).fill(null) );
    const [user,setUser] = useState(1);
    
    console.log("Board", board);
    
    function renderSquare(i) {
        return ( <Square index={ i } value={ board[i] }  onClick={ ()=>onClickSquare(i) } /> );
    }
    
    function onClickSquare(index){
        const [winner, winning_spots] = calculateWinner();
        if (board[index] || winner !=  null){
            return;
        }
        const boardCopy = board.slice();
        boardCopy[index] = getValue(user)
        
        changeUser(user)
        
        setBoard(boardCopy);
        socket.emit('board', { board: boardCopy });
    }
    
    function getValue(usr){
        if(usr == 2){
            return 'O';
        }
        else if (usr == 1){
            return 'X';
        }
        else{
            return ' ';
        }
    }
    
    function changeUser(usr){
        if (usr == 1){      
            setUser( 2 ) 
        }
        else if (usr == 2){ 
            setUser( 1 ) 
        }
    }
    
    function calculateWinner() {
        const winning_moves = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        
        for (let i = 0; i < winning_moves.length; i++) {
            const [a, b, c] = winning_moves[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return [ board[a], winning_moves[i] ];
            }
        }
        
        return [null, null];
    }
    
    function calculateTie() {
        const [winner, moves] = calculateWinner();
        if (!board.includes(null) && winner == null){
            return true;
        }
        return false;
    }
    
    
    function onClickPlayAgain(){
        setBoard( Array(9).fill(null) )
        setUser( 1 )
    }
    
    useEffect(() => {
        socket.on('board', (data) => {
            console.log('Board event received!');
            console.log(data);
            
            const boardCopy = data.board;
            setBoard( boardCopy );
            changeUser(user)
        });
    }, [board, user]);
    
    const [winner, moves] = calculateWinner();
    const tie = calculateTie();
    
    // UPDATE STATUS
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if(tie){
        status = "Tie!!"
    } else{
        status = 'Next player: ' + getValue(user);
    }
    
    // UPDATE PLAY AGAIN
    let play_again;
    
    
    return (
        <div>
            <div> { status } </div>
            <div class="board" >
                { renderSquare(0) }
                { renderSquare(1) }
                { renderSquare(2) }
                { renderSquare(3) }
                { renderSquare(4) }
                { renderSquare(5) }
                { renderSquare(6) }
                { renderSquare(7) }
                { renderSquare(8) }
            </div>
            {winner||tie?
            <button onClick={onClickPlayAgain}> Play Again </button>: null
            }
            
        </div>
    );
}




    
    // When clicked change user to next person
    // function onBoardClick(){
    //     if(user == 1){
    //         setUser(2);
    //     }
    //     else{
    //         setUser(1);
    //     }
    //     const boardCopy = board.slice();
    //     setBoard(boardCopy);
    //     socket.emit('board', { board: boardCopy });
    // }