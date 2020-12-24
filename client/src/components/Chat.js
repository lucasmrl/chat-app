import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io();

function Chat() {
  const [nickname, setNickname] = useState();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat message", ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });
    return () => {
      socket.off();
    };
  }, [chat]);

  const submitMsg = () => {
    socket.emit("chat message", { nickname, msg });
    setChat([...chat, { nickname, msg }]);
    setMsg("");
  };

  return (
    <div className="">
      <h1>Chat-app!</h1>
      <div>
        <span>Nickname:</span>
        <input onChange={(e) => setNickname(e.target.value)} value={nickname} />
      </div>
      <input onChange={(e) => setMsg(e.target.value)} value={msg} />
      <button onClick={submitMsg}>Send</button>
      {chat.map((el, index) => (
        <div key={index}>
          <p>
            {el.nickname} : {el.msg}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Chat;
