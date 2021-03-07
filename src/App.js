import './App.css'; 
import { Login } from './Login.js';


import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
    return (
        <div>
            <Login socket={socket} />
        </div>
    );
}

export default App; 