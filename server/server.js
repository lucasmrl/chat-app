const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

let usersOn = new Set();
let socketsConneted = new Map();

io.on("connection", (socket) => {
  let { id } = socket.client;
  socketsConneted.set(socket.client.id, socket.id);
  console.log(`User connected: ${id}`);
  usersOn.add(id);
  console.log(usersOn);
  let arrayOfUsers = Array.from(usersOn);

  socket.on("new-user", () => {
    socket.broadcast.emit("welcome", id);
  });

  socket.on("user-typing", () => {
    socket.broadcast.emit("display-typing", id);
  });

  io.emit("users-on", arrayOfUsers);

  socket.on("chat message", ({ nickname, msg }) => {
    console.log(`${nickname}: ${msg}`);
    socket.broadcast.emit("chat message", { nickname, msg });
  });

  socket.on("chat message private", ({ toUser, nickname, msg }) => {
    console.log(`from ${id} to ${toUser}: ${msg}`);
    let socketId = socketsConneted.get(toUser);
    io.to(socketId).emit("private msg", { id, nickname, msg });
  });

  socket.on("disconnect", () => {
    usersOn.delete(id);
    arrayOfUsers = Array.from(usersOn);
    io.emit("users-on", arrayOfUsers);
    socket.broadcast.emit("user-disconnected", id);
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
