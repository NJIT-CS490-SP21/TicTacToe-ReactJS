import { useState, useRef, useEffect } from 'react';
import './Board.css';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

export function Board(props){
    const [board,setBoard] = useState( Array(9).fill(null) );
    const [user,setUser] = useState(1);
    let index = 0;
    
    function renderSquare(i) {
        return ( <Square index={ i } value={ board[i] }  onClick={ ()=>onClickSquare(i) } /> );
    }
    
    function onClickSquare(index){
        if (props.perm == 'S'){
            return;
        }
        
        if (props.perm != getValue(user)){
            return;
        }
        
        const [winner, winning_spots] = calculateWinner();
        if (board[index] || winner !=  null){
            return;
        }
        const boardCopy = board.slice();
        boardCopy[index] = getValue(user)
        
        changeUser(user)
        setBoard(boardCopy);
        
        const userCopy = user;
        socket.emit('board', { board: boardCopy, user: userCopy});
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
        socket.emit('reset', );
    }
    
    useEffect(() => {
        socket.on('board', (data) => {
            console.log('Board event received!');
            console.log(data);
            console.log(index);
            index = index + 1;
            
            setBoard( data.board );
            changeUser(data.user)
        });
        
        socket.on('reset', () => {
            console.log('Reset event received!')
            setBoard( Array(9).fill(null) )
            setUser( 1 )
        });
        
    }, []);
    
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
    
    
    return (
        <div>
            <player> { status } </player>
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
            <br />
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