import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Chat } from './Chat.js';
import { Board } from './Board.js';
import { ListItem } from './ListItem.js';

const socket = io();

export function Login() {
    const [login, setLogin] = useState(false);
    const [usernameError, setError] = useState('');
    const [users, setUsers] = useState([]);
    
    
    const inputRef = useRef(null);
    
    let username;
    
    function onClickLogin() {
        if (inputRef == null || inputRef.current.value == '') {
            setError("You must enter a username");
            return;
        }
        username = inputRef.current.value;
    
        
        setUsers(prev => [...prev, username]);
        socket.emit('login', [...users, username]);
        setLogin(true);
    }
    
    function onClickLogout() {
        setLogin(false);
        setError('');
        
        //remove username from userList
        let usersCopy = users.splice();
        let index = users.indexOf(username);
        
        usersCopy.splice(index, 1);
        
        setUsers(usersCopy);
        
        socket.emit('logout', {users: users})
    }
    
    useEffect(() => {
        socket.on('login', (data) => {
            console.log('login event received!');
            console.log(data);
            setUsers(data);
        });
        
        socket.on('logout', (data) => {
            console.log('Chat event received!');
            console.log(data);
            
            setUsers(data.users);
        });
        
    }, []);
    
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
                Logged in as: { username }
                <Board />
                <button onClick={onClickLogout}>Logout</button>
                <Chat />
                
                List of logged users: 
                <ul>
                    {users.map((item, index) => <ListItem key={index} name={item} />)}
                </ul>
            </div>
        );
    }
    
}