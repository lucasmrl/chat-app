[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/lucasmrl/chat-app">
    <p>🦜</p>
  </a>

  <h3 align="center">Chat-app</h3>

  <p align="center">
    A chat app built with Node.js, Socket.io, React.js, and Tailwind CSS.
    <br />
    <br />
    <a href="http://chat-app-on.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/lucasmrl/chat-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/lucasmrl/chat-app/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Chat-app🦜][product-screenshot]](https://example.com)

A realtime app to exchange messages with connected users. Built for learning purposes. This was the first time using **Socket.io**, so I decided to follow their tutorial to create a chat app and I added a few of the suggested features.

### Built With

- Node.js
- Socket.io
- React.js
- Tailwind CSS

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You need to have npm installed.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lucasmrl/chat-app.git
   ```
2. From the root, install NPM packages
   ```sh
   npm install
   ```
3. Run the project using this command:
   ```sh
   npm run dev
   ```

### Deploy (Example using Heroku)

- uncomment lines 10-13 from "server.js"
  ```sh
   // app.use(express.static(path.join(__dirname, "client/build")));
   // app.get("/*", function (req, res) {
   //   res.sendFile(path.join(__dirname, "client/build", "index.html"));
   // });
  ```

<!-- USAGE EXAMPLES -->

## Features

- Support for nickname
- Message to connected users when someone connects or disconnects.
- List with online users
- Private messages
- Mobile friendly

## Future improvements

- Add “{user} is typing” functionality.
- Support for changing avatar image
- Option to create/join different "rooms"
- Add rich text editor
- Add support for videos, images, and GIFs.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.
