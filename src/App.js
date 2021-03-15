import React from 'react';
import io from 'socket.io-client';
import Login from './Login';
import './App.css';

const socket = io(); // Connects to socket connection

function App() {
  return (
    <div>
      <Login socket={socket} />
    </div>
  );
}

export default App;
