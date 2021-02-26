import './App.css';
import { Board } from './Board.js';
import { Login } from './Login.js';
import { Chat } from './Chat.js';

import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    

    
    if (false) {
        return (
            <div>
                <Login />
            </div>
        );
    }    
    
    return (
        <div>
            <Board />
            
            <Chat />
        </div>
    );
}

export default App;