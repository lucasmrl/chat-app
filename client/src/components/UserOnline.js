import React from "react";

function UserOnline({ nickname }) {
  return (
    <li className="w-52 flex justify-start pl-1 py-2 hover:bg-purple-50 hover:text-black cursor-pointer ">
      <div className="flex items-center">
        <div class="block pr-2 justify-start">
          <img
            alt="profil"
            src="https://www.tailwind-kit.com/images/person/1.jpg"
            class="rounded-full h-10 w-10 "
          />
        </div>
        <p className="">{nickname}</p>
      </div>
    </li>
  );
}

export default UserOnline;
