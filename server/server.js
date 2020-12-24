const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

io.on("connection", (socket) => {
  let { id } = socket.client;
  console.log(`User connected: ${id}`);

  socket.on("chat message", ({ nickname, msg }) => {
    console.log(`${nickname}: ${msg}`);
    socket.broadcast.emit("chat message", { nickname, msg });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: " + id);
  });
});

server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));
