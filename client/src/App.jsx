import React from "react";
import PostList from "./components/PostList";
import "./App.css";

const App = () => {
  return (
    <div>
      <h2 className="title">My Posts</h2>
      <PostList />
    </div>
  );
};

export default App;
