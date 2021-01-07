import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { default as socket } from "./ws";
import UserOnline from "./UserOnline";

function Chat() {
  let { user_nickName } = useParams();
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [toUser, setToUser] = useState("");

  useEffect(() => {
    setNickname(user_nickName);
    socket.on("chat message", ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });

    socket.on("private msg", ({ id, nickname, msg }) => {
      setChat([...chat, `Private Message from :${nickname} - ${msg}`]);
    });

    return () => {
      socket.off();
    };
  }, [chat, toUser, user_nickName]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("new-user");
    });

    socket.on("users-on", (list) => {
      setUsersOnline(list);
    });

    socket.on("welcome", (user) => {
      setChat([...chat, `Welcome to our chat ${user} 😃`]);
    });

    socket.on("user-disconnected", (user) => {
      setChat([...chat, `Bye bye ${user} 😞`]);
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

  const saveUserToPrivateMsg = (userID) => {
    setToUser(userID);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100 divide-solid">
      <div className="flex bg-white w-5/6 h-5/6 mx-auto my-auto shadow-md">
        {/* Users online */}
        <div className="pl-8 w-64 overflow-auto">
          <p className="font-black my-4 text-xl">
            {" "}
            # Online: ({usersOnline !== null ? usersOnline.length : "0"}):
          </p>
          {/* {usersOnline !== null
              ? usersOnline.map((el) => (
                  <li>
                    <button onClick={() => saveUserToPrivateMsg(el)}>
                      {el}
                    </button>
                  </li>
                ))
              : ""} */}{" "}
          <ul className="w-full divide-y divide-gray-300">
            {usersOnline !== null
              ? usersOnline.map((el) => (
                  <button
                    onClick={() => saveUserToPrivateMsg(el)}
                    class="block focus:outline-none"
                  >
                    <UserOnline nickname={el} />
                  </button>
                ))
              : ""}
          </ul>
        </div>
        <div className="flex flex-col flex-grow">
          {/* Messages */}
          <div className="bg-red-200 h-5/6 overflow-auto">
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
          {/* Input */}
          <div className="bg-blue-200 h-1/6">
            <input
              className="block md:inline bg-red-400 mx-1 px-3 py-1 lg:text-2xl rounded-lg text-xl text-gray-800 focus:outline-none focus:shadow-outline shadow"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
            />
            {toUser === "" ? <p>To all users</p> : <p>To user: {toUser}</p>}
            <button onClick={submitMsg}>Send</button>
          </div>
        </div>
      </div>
      {/* <h1>Chat-app!</h1>
      <p className="font-black">
        {" "}
        Users online ({usersOnline !== null ? usersOnline.length : "0"}):
      </p>
      <ul>
        {usersOnline !== null
          ? usersOnline.map((el) => (
              <li>
                <button onClick={() => saveUserToPrivateMsg(el)}>{el}</button>
              </li>
            ))
          : ""}
      </ul>
      <input
        className="block md:inline bg-red-400 mx-1 px-3 py-1 lg:text-2xl rounded-lg text-xl text-gray-800 focus:outline-none focus:shadow-outline shadow"
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
      ))} */}
    </div>
  );
}

export default Chat;
