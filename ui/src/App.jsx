import React, { useState, useEffect } from 'react'
import './App.css'

import { registerOnMessageCallback, send } from './websocket'
import Login from './components/Login'
import ChatBox from './ChatBox'

export const App = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);

  const onMessageReceived = (msg) => {
    msg = JSON.parse(msg);
    setMessages((prevMessages) => [...prevMessages, msg]);
  }

  const setUserName = (name) => setUsername(name);

  const sendMessage = (info) => {
    const message = {
      username: username,
      type: info.type,
      content: info.content
    }
    send(JSON.stringify(message));
  }

  useEffect(() => {
    registerOnMessageCallback(onMessageReceived);
  }, []);


  if (username === null) {
    return (
      <div>
        {/* <div>Enter username</div>
        <TextBar onSend={setUserName} /> */}
        <h1>QiZi-ChatBox</h1>
        <Login onSend={setUserName}></Login>
      </div>
    )
  }
  return (
    <div>
      <ChatBox messages={messages} username={username} onSend={sendMessage}></ChatBox>
    </div>
  )
}

export default App
