import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Chat } from './Chat.js';
import { Board } from './Board.js';

export function Login() {
    const [login, setLogin] = useState(false);
    const [usernameError, setError] = useState('');
    const inputRef = useRef(null);
    
    let username = null;
    
    function onClickLogin(){
        if (inputRef == null || inputRef.current.value == '') {
            setError("You must enter a username");
            return;
        }
        username = inputRef.current.value;
        setLogin(true);
    }
    
    function onClickLogout(){
        setLogin(false);
        setError('');
    }
    
    
    if (!login){
        return (
            <div>
                <div>
                    <h1>Login</h1>
                    Username: <input ref={inputRef} type="text" />
                    <button onClick={onClickLogin}>Login</button>
                </div>
                <div>
                    { usernameError }
                </div>
            </div>    
        );
    } else if (login){
        return (
            <div>
                Logged in as: { inputRef.current.value }
                <Board />
                <button onClick={onClickLogout}>Logout</button>
                <Chat />
            </div>
        );
    }
    
}