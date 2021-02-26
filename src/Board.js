import { useState, useRef, useEffect } from 'react';
import './Board.css';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

export function Board(){
    const [board,setBoard] = useState( Array(9).fill('') );
    const [user,setUser] = useState(1);
    
    console.log("Board", board);
    
    function renderSquare(i) {
        return ( <Square index={ i } value={ board[i] }  onClick={ ()=>onClickSquare(i) } /> );
    }
    
    function onClickSquare(index){
        const boardCopy = board.slice();
        boardCopy[index] = getValue(user)
        
        console.log('User: ',user)
        changeUser(user)
        console.log('Updated user: ',user)
        
        // console.log(user)
        
        setBoard(boardCopy);
        socket.emit('board', { board: boardCopy });
        
    }
    
    function getValue(usr){
        if(usr == 2){
            return 'O';
        }
        else if (usr == 1){
            setUser( 2 );
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
    
   
    
    useEffect(() => {
        socket.on('board', (data) => {
            console.log('Board event received!');
            console.log(data);
            
            const boardCopy = data.board;
            setBoard( boardCopy );
            changeUser(user)
        });
    }, [board, user]);
    
    return (
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