import React, { useState, useEffect } from "react";
//import axios from "axios";
import io from "socket.io-client";
const socket = io();

function App() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat message", ({ id, msg }) => {
      setChat([...chat, { id, msg }]);
    });
  }, [chat]);

  const submitMsg = () => {
    socket.emit("chat message", msg);
    setMsg("");
  };

  return (
    <div className="App">
      <h1>Chat-app!</h1>
      <input onChange={(e) => setMsg(e.target.value)} value={msg} />
      <button onClick={submitMsg}>Send</button>
      {chat.map((el, index) => (
        <div key={index}>
          <p>
            {el.id} : {el.msg}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
