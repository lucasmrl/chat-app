const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

const PORT = process.env.PORT || 8080;

// REMOVE COMMENTS BELOW WHEN READY TO DEPLOY
// app.use(express.static(path.join(__dirname, "client/build")));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

let usersConnected = new Map();

io.on("connection", (socket) => {
  let { id } = socket.client;

  socket.on("user nickname", (nickname) => {
    //  1) When the CLIENT sends the 'nickname', we store the 'nickname',
    //  'socket.client.id', and 'socket.id in a Map structure
    usersConnected.set(nickname, [socket.client.id, socket.id]);

    //  2) Send list with connected sockets
    io.emit("users-on", Array.from(usersConnected.keys()));

    //  3) Send to all other users the 'nickname' of the new socket connected
    socket.broadcast.emit("welcome", nickname);
  });

  socket.on("chat message", ({ nickname, msg }) => {
    socket.broadcast.emit("chat message", { nickname, msg });
  });

  socket.on("chat message private", ({ toUser, nickname, msg }) => {
    let socketId = usersConnected.get(toUser)[1];
    io.to(socketId).emit("private msg", { id, nickname, msg });
  });

  socket.on("disconnect", () => {
    let tempUserNickname;
    // TODO: Improve this - Big O (N) - Not good if we have a lot of sockets connected
    // Find the user and remove from our data structure
    for (let key of usersConnected.keys()) {
      if (usersConnected.get(key)[0] === id) {
        tempUserNickname = key;
        usersConnected.delete(key);
        break;
      }
    }
    // Send to client the updated list with users connected
    io.emit("users-on", Array.from(usersConnected.keys()));

    // Send to cliente the nickname of the user that was disconnected
    socket.broadcast.emit("user-disconnected", tempUserNickname);
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
