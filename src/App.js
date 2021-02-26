import './App.css';
import { Board } from './Board.js';
import { Login } from './Login.js';
import { Chat } from './Chat.js';

import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    return (
        <div>
            <Login />
        </div>
    );
}

export default App;