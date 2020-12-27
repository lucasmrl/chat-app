import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io();

function Chat() {
  const [nickname, setNickname] = useState();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("chat message", ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });
    return () => {
      socket.off();
    };
  }, [chat, users]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("new-user", "test");
    });

    socket.on("welcome", (user) => {
      setUsers([...users, user]);
      setChat([...chat, `Welcome to our chat ${user}`]);
    });

    return () => {
      socket.off();
    };
  }, [chat, users]);

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
          {el.nickname != null ? (
            <p>
              {el.nickname} : {el.msg}
            </p>
          ) : (
            <p>{el}</p>
          )}
        </div>
      ))}
      {/* {users.map((el, index) => (
        <div key={index}>
          <p>{el} entrou no chat!</p>
        </div>
      ))} */}
    </div>
  );
}

export default Chat;
