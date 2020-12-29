const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

let usersOn = new Set();

io.on("connection", (socket) => {
  let { id } = socket.client;
  console.log(`User connected: ${id}`);
  usersOn.add(id);
  console.log(usersOn);
  let arrayOfUsers = Array.from(usersOn);

  socket.on("new-user", (text) => {
    socket.broadcast.emit("welcome", id);
  });

  io.emit("users-on", arrayOfUsers);

  socket.on("chat message", ({ nickname, msg }) => {
    console.log(`${nickname}: ${msg}`);
    socket.broadcast.emit("chat message", { nickname, msg });
  });

  socket.on("disconnect", () => {
    usersOn.delete(id);
    arrayOfUsers = Array.from(usersOn);
    io.emit("users-on", arrayOfUsers);
    socket.broadcast.emit("user-disconnected", id);
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
