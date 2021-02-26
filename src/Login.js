import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

export function Login() {
    
    const inputRef = useRef(null);
    
    function onClickLogin(){
        if (inputRef != null) {
            const username = inputRef.current.value;
        }
    }
    
    return (
        <div>
            <h1>Login</h1>
            Username: <input ref={inputRef} type="text" />
            <button onClick={onClickLogin}>Login</button>
        </div>    
    );
}