import React, { useState, useRef, useEffect } from 'react';

import logo from './logo.svg';

import Chat from './Chat';
import Board from './Board';
import ListItem from './ListItem';
import Leaderboard from './Leaderboard';

import './Login.css';

function Login(props) {
  const { socket } = props;
  const [login, setLogin] = useState(false);
  const [usernameError, setError] = useState('');

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState(null);

  const inputRef = useRef(null);

  function onClickLogin() {
    if (inputRef === null || inputRef.current.value === '') {
      setError('You must enter a username');
      return;
    }
    const input = inputRef.current.value;
    setUsername(input);

    setUsers((prev) => [...prev, input]);
    socket.emit('login', input);
    setLogin(true);
  }

  function onClickLogout() {
    setLogin(false);
    setError('');

    // remove username from userList
    const usersCopy = users.splice();
    const index = users.indexOf(username);
    usersCopy.splice(index, 1);
    setUsers(usersCopy);

    socket.emit('logout', username);
  }

  // LOGIN AND LOGOUT
  useEffect(() => {
    socket.on('login', (data) => {
      console.log('login event received!');
      console.log(data);
      setUsers(data);
      console.log('Username is: ', username);

      if (data[0] === username) {
        console.log('Permissions set to X');
        setPermission('X');
      } else if (data[1] === username) {
        console.log('Permissions set to O');
        setPermission('O');
      } else {
        console.log('Permissions set to S');
        setPermission('S');
      }
    });

    socket.on('logout', (data) => {
      console.log('logout event received!');
      console.log(data);
      setUsers(data);

      if (data[0] === username) {
        console.log('Permissions set to X');
        setPermission('X');
      } else if (data[1] === username) {
        console.log('Permissions set to O');
        setPermission('O');
      } else {
        console.log('Permissions set to S');
        setPermission('S');
      }
    });
  }, [username]);

  if (!login) {
    return (
      <div className="login">
        <h1>
          Login
          {' '}
          <img src={logo} className="App-logo" alt="logo" />
          {' '}
        </h1>
        <p1>
          {' '}
          Please enter the username you are going to be using while in our
          server.
        </p1>
        {' '}
        <br />
        <div className="username">
          <p2>
            Username:
            {' '}
            <input className="loginInput" ref={inputRef} type="text" />
            {' '}
          </p2>
          <button className="button" type="submit" onClick={onClickLogin}>
            Login
          </button>
          <p3>
            {' '}
            {usernameError}
            {' '}
          </p3>
        </div>
      </div>
    );
  }
  if (login) {
    return (
      <div className="screen">
        <div>
          <status>
            Logged in as:
            {' '}
            {username}
            {' '}
            - Player Status:
            {' '}
            {permission}
            {' '}
            <br />
            {' '}
          </status>
          <button className="button1" type="submit" onClick={onClickLogout}>
            Logout
          </button>
        </div>

        <div className="board">
          <Board socket={socket} perm={permission} />
        </div>

        <div className="one">
          <Chat socket={socket} />
        </div>
        <div className="one">
          <h3> List of logged users: </h3>
          <ul>
            {users.map((item) => (
              <ListItem name={item} />
            ))}
          </ul>
        </div>

        <div>
          <Leaderboard socket={socket} user={username} />
        </div>
      </div>
    );
  }
}

export default Login;
