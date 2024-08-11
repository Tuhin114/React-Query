import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api/api";

const App = () => {
  const { data, isLoading, status } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  console.log(data, isLoading, status);
  return <div>Hello</div>;
};

export default App;
