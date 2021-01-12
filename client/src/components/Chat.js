import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useHistory } from "react-router-dom";
import { default as socket } from "./ws";
import UserOnline from "./UserOnline";

function Chat() {
  let { user_nickName } = useParams();
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [toUser, setToUser] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("chatConnected")) {
      history.push(`/`);
    }

    window.addEventListener("beforeunload", () =>
      localStorage.removeItem("chatConnected")
    );

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
  }, [chat, toUser, user_nickName, history]);

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
      if (user !== null) {
        setChat([...chat, `${user} left the chat 👋🏻`]);
      }
    });

    return () => {
      socket.off();
    };
  }, [chat]);

  const submitMsg = (e) => {
    e.preventDefault();

    if (msg === "") {
      toast("Enter a message.", {
        duration: 4000,
        // Styling
        style: {},
        className: "",
        // Custom Icon
        icon: "⚠️",
        // Aria
        role: "status",
        ariaLive: "polite",
      });
    } else if (toUser === nickname) {
      toast("Select a different user.", {
        duration: 4000,
        // Styling
        style: {},
        className: "",
        // Custom Icon
        icon: "⚠️",
        // Aria
        role: "status",
        ariaLive: "polite",
      });
    } else if (toUser !== "") {
      let selectElem = document.getElementById("usersOn");
      selectElem.selectedIndex = 0;
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
    <div className="flex w-screen main-chat lg:h-screen bg-gray-900 divide-solid">
      <Toaster />
      <div className="flex w-full lg:w-5/6 lg:h-5/6 lg:mx-auto lg:my-auto shadow-md">
        {/* Users online */}
        <div className="hidden lg:block pl-4 pr-4 w-64 bg-purple-900 text-white">
          <p className="font-black my-4 text-xl">
            {" "}
            # Online: ({usersOnline !== null ? usersOnline.length : "0"}):
          </p>
          <ul className="divide-y divide-gray-300 truncate">
            {usersOnline !== null
              ? usersOnline.map((el, index) => (
                  <button
                    key={index}
                    onClick={() => saveUserToPrivateMsg(el)}
                    className="block focus:outline-none truncate"
                  >
                    <UserOnline nickname={el} />
                  </button>
                ))
              : ""}
          </ul>
        </div>
        <div className="flex flex-col flex-grow lg:max-w-full bg-purple-50">
          {/* Messages */}
          <p className="font-black mt-4 mb-2 pl-4 lg:pl-8 text-2xl">
            Main Chat
          </p>
          <div
            id="msg"
            className="h-5/6 overflow-y-auto pl-4 lg:pl-8 pt-4 mb-2 lg:mb-0"
          >
            <ul className="w-full lg:w-96">
              {chat.map((el, index) => (
                <li
                  key={index}
                  className="w-screen break-words pr-6 lg:pr-0 lg:w-full"
                >
                  {el.nickname != null ? (
                    `${el.nickname}: ${el.msg}`
                  ) : (
                    <p className="text-base font-semibold text-purple-900 rounded py-1">
                      {el}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <form className="">
            <div className="px-8">
              <select
                className="lg:hidden text-xs flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-green-400 placeholder-gray-400 shadow-sm focus:outline-none"
                id="usersOn"
                onChange={(e) => saveUserToPrivateMsg(e.target.value)}
              >
                <option value="" className="">
                  Everyone
                </option>
                {usersOnline !== null
                  ? usersOnline.map((el, index) => (
                      <option value={el} className="" key={index}>
                        {el}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="w-full flex p-4 lg:p-8 bg-purple-50">
              {" "}
              <div className="flex relative w-full lg:w-5/6">
                <span className="rounded-l-md inline-flex items-center px-1 lg:px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  {toUser === "" ? (
                    <p className="bg-purple-400 text-white text-xs lg:text-base font-normal rounded p-1">
                      To: Everyone
                    </p>
                  ) : (
                    <p className="bg-purple-700 text-white text-xs lg:text-base font-semibold rounded p-1 w-20 lg:w-28 truncate">
                      To: {toUser}
                    </p>
                  )}
                </span>
                <input
                  type="text"
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                  name="message"
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                />
              </div>
              <div className="hidden lg:block w-1/6">
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
