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
      setChat([...chat, `🔒 Private Message from ${nickname}: ${msg}`]);
    });

    let objDiv = document.getElementById("msg");
    objDiv.scrollTop = objDiv.scrollHeight;

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
      setChat([...chat, `${user} left the chat 👋🏻`]);
    });

    return () => {
      socket.off();
    };
  }, [chat]);

  const submitMsg = (e) => {
    e.preventDefault();
    if (toUser !== "") {
      socket.emit("chat message private", { toUser, nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setChat([...chat, `🔒 Private Message for ${toUser}: ${msg}`]);
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
    <div className="flex w-screen h-screen bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 divide-solid">
      <div className="flex bg-white w-5/6 h-5/6 mx-auto my-auto shadow-md">
        {/* Users online */}
        <div className="pl-8 w-64 overflow-auto bg-purple-900 text-white">
          <p className="font-black my-4 text-xl">
            {" "}
            # Online: ({usersOnline !== null ? usersOnline.length : "0"}):
          </p>
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
        <div className="flex flex-col flex-grow bg-purple-50">
          {/* Messages */}
          <p className="font-black mt-4 mb-2 pl-8 text-2xl">Main Chat</p>
          <div id="msg" className="h-5/6 overflow-y-auto pl-8 pt-4">
            {chat.map((el, index) => (
              <div key={index}>
                {el.nickname != null ? (
                  <p>
                    {el.nickname}: {el.msg}
                  </p>
                ) : (
                  <div>
                    <p className="text-base font-semibold text-purple-900 rounded py-1">
                      {el}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <form className="">
            <div className="w-full flex p-8 bg-purple-50">
              {" "}
              <div className="flex relative w-5/6">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  {toUser === "" ? (
                    <p className="bg-purple-400 text-white text-base font-normal rounded p-1">
                      To: Everyone
                    </p>
                  ) : (
                    <p className="bg-purple-700 text-white text-base font-semibold rounded p-1">
                      To: {toUser}
                    </p>
                  )}
                </span>
                <input
                  type="text"
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                  name="message"
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                />
              </div>
              <div className="w-1/6">
                <button
                  className="ml-8 flex-shrink-0 bg-green-400 text-gray-700 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2"
                  onClick={(e) => submitMsg(e)}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
