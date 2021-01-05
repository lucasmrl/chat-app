import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Chat from "./components/Chat";
import Join from "./components/Join";

function App() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Join</Link>
        </li>
        <li>
          <Link to="/chat">chat</Link>
        </li>
      </ul>

      <Route path="/" exact component={Join} />
      <Route path="/chat" exact component={Chat} />
    </Router>
  );
}

export default App;
