import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

import { Chat } from './Chat.js';
import { Board } from './Board.js';
import { ListItem } from './ListItem.js';
import logo from './logo.svg';

import './Login.css'

const socket = io();

export function Login() {
    const [login, setLogin] = useState(false);
    const [usernameError, setError] = useState('');

    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [permission, setPermission] = useState(null)

    const inputRef = useRef(null);

    function onClickLogin() {
        if (inputRef == null || inputRef.current.value == '') {
            setError("You must enter a username");
            return;
        }
        const input = inputRef.current.value
        setUsername(input);

        setUsers(prev => [...prev, input]);
        socket.emit('login', input);
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

        socket.emit('logout', username)
    }

    useEffect(() => {
        socket.on('login', (data) => {
            console.log('login event received!');
            console.log(data);
            setUsers(data);
            if (users[0] == username) {
                setPermission('X');
            } else if (users[1] == username){
                setPermission('O');
            } else {
                setPermission('S');
            }
        });

        socket.on('logout', (data) => {
            console.log('logout event received!');
            console.log(data);
            setUsers(data);
        });

    }, []);

    if (!login) {
        return (
            <div class='login'>
                <h1>Login  <img src={logo} className="App-logo" alt="logo" /> </h1>   
                
                <p1> Please enter the username you are going to be using while in our server.</p1> <br />
                <div class='username'>
                    <p2>Username: <input ref={inputRef} type="text" /> </p2> 
                    <button class='button' onClick={onClickLogin}>Login</button>
                    <p3> { usernameError } </p3>
                </div>
                
                
            </div>
        );
    }
    else if (login) {
        return (
            <div>
                Logged in as: { username } - Player Status: { permission }
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