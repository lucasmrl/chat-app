const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

io.on("connection", (socket) => {
  const { id } = socket.client;
  console.log(`User connected: ${id}`);
  socket.on("chat message", (msg) => {
    console.log(`${id}: ${msg}`);
    io.emit("chat message", { id, msg });
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
