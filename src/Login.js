import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Chat } from './Chat.js';
import { Board } from './Board.js';

export function Login() {
    const [login, setLogin] = useState(false);
    const inputRef = useRef(null);
    
    function onClickLogin(){
        if (inputRef != null) {
            const username = inputRef.current.value;
        }
        setLogin(true);
    }
    
    
    if (!login){
        return (
            <div>
                <h1>Login</h1>
                Username: <input ref={inputRef} type="text" />
                <button onClick={onClickLogin}>Login</button>
            </div>    
        );
    } else if (login){
        return (
            <div>
                <Board />
                <Chat />
            </div>
        );
    }
    return null;
    
}