import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { default as socket } from "./ws";

function Chat() {
  const [nickname, setNickname] = useState();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [online, setOnline] = useState([]);
  const [toUser, setToUser] = useState("");

  useEffect(() => {
    socket.on("chat message", ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });

    socket.on("private msg", ({ id, nickname, msg }) => {
      setChat([...chat, `Private Message from :${nickname} - ${msg}`]);
    });

    return () => {
      socket.off();
    };
  }, [chat, toUser]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("new-user");
    });

    socket.on("users-on", (list) => {
      setOnline(list);
    });

    socket.on("welcome", (id) => {
      setChat([...chat, `Welcome to our chat ${id} 😃`]);
    });

    socket.on("user-disconnected", (id) => {
      setChat([...chat, `Bye bye ${id} 😞`]);
    });

    return () => {
      socket.off();
    };
  }, [chat]);

  const submitMsg = () => {
    if (toUser !== "") {
      socket.emit("chat message private", { toUser, nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setChat([...chat, `Private Message for: ${toUser} - ${msg}`]);
      setMsg("");
      setToUser("");
    } else {
      socket.emit("chat message", { nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setMsg("");
    }
  };

  const typingListener = () => {
    socket.emit("user-typing");
  };

  const saveUserToPrivateMsg = (userID) => {
    setToUser(userID);
  };

  return (
    <div className="">
      <h1>Chat-app!</h1>
      <p>Users online ({online !== null ? online.length : "0"}):</p>
      <ul>
        {online !== null
          ? online.map((el) => (
              <li>
                <button onClick={() => saveUserToPrivateMsg(el)}>{el}</button>
              </li>
            ))
          : ""}
      </ul>
      <div>
        <span>Nickname:</span>
        <input onChange={(e) => setNickname(e.target.value)} value={nickname} />
      </div>
      <input
        onChange={(e) => {
          setMsg(e.target.value);
          typingListener();
        }}
        value={msg}
      />
      {toUser === "" ? <p>To all users</p> : <p>To user: {toUser}</p>}
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
    </div>
  );
}

export default Chat;
