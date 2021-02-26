import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

export function Login() {
    
    const inputRef = useRef(null);
    
    
    return (
        <div>
            <h1>Login</h1>
            Enter message here: <input ref={inputRef} type="text" />
        </div>    
    );
}