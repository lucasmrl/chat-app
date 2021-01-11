import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { default as socket } from "./ws";

function Join() {
  const [nickname, setNickname] = useState();
  const history = useHistory();
  const handleOnClick = () => history.push(`/chat/${nickname}`);

  useEffect(() => {
    localStorage.setItem("chatConnected", "true");
  }, []);

  const submitNickname = () => {
    socket.emit("user nickname", nickname);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="grid place-items-center my-auto">
        <h1 className="font-bold text-4xl pb-10 text-gray-900 antialiased">
          Chat App 🦜
        </h1>
        <form className="flex w-full max-w-sm space-x-3 justify-center">
          <div className="relative ">
            <input
              type="text"
              onChange={(e) => setNickname(e.target.value)}
              className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Nickname"
            />
          </div>
          <button
            className="flex-shrink-0 bg-green-400 text-gray-800 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
            onClick={() => {
              submitNickname();
              handleOnClick();
            }}
            type="submit"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}

export default Join;
