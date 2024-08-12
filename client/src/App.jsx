import React, { useState } from "react";
import PostList from "./components/PostList";
import "./App.css";

const App = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div>
      <h2 className="title">My Posts</h2>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      {toggle ? <PostList /> : <p>Toggle is off</p>}
    </div>
  );
};

export default App;
