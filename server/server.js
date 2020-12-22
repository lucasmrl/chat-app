const express = require("express");
const app = express();
const port = 8080;

app.get("/test", (req, res) => {
  res.send("Frontend connected with Backend! 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
