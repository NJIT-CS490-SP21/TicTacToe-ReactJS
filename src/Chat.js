import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import './Chat.css';

function Chat(props) {
  const { socket } = props;
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element

  function onClickButton() {
    if (inputRef != null) {
      const message = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to
      // render it on the UI.
      setMessages((prevMessages) => [...prevMessages, message]);
      socket.emit('chat', { message });
    }
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('chat', (data) => {
      // console.log('Chat event received!');
      // console.log(data);

      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
  }, []);

  return (
    <div className="chat">
      <message>Chat:</message>
      {' '}
      <br />
      <enterMessage>
        {' '}
        Enter message here:
        {' '}
        <input ref={inputRef} type="text" />
        {' '}
      </enterMessage>
      <button type="submit" onClick={onClickButton}>Send</button>
      <ul>
        {messages.map((item) => (
          <ListItem name={item} />
        ))}
      </ul>
    </div>
  );
}

Chat.propTypes = {
  socket: PropTypes.instanceOf(io()),
};

Chat.defaultProps = {
  socket: null,
};

export default Chat;
