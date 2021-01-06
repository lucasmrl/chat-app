import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { default as socket } from "./ws";

function Join() {
  const [nickname, setNickname] = useState();
  const history = useHistory();
  const handleOnClick = () => history.push(`/chat/${nickname}`);

  const submitNickname = () => {
    socket.emit("user nickname", nickname);
  };

  return (
    <div className="">
      <form className="flex w-full max-w-sm space-x-3">
        <div className=" relative ">
          <input
            type="text"
            onChange={(e) => setNickname(e.target.value)}
            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Nickname"
          />
        </div>
        <button
          className="flex-shrink-0 bg-purple-600 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
          onClick={() => {
            submitNickname();
            handleOnClick();
          }}
          type="submit"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}

export default Join;
