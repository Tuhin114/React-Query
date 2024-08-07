import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

const App = () => {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // queryFn: () => Promise.reject("Error message"),
  });

  const newPostMutation = useMutation({
    mutationFn: (title) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postsQuery.isLoading) return <h1>Loading...</h1>;
  if (postsQuery.error) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }
  return (
    <div>
      {postsQuery.data.map((post) => (
        <div key={post.id}>
          <div>{post.title}</div>
        </div>
      ))}
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("New Post")}
      >
        Add New
      </button>
    </div>
  );
};

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
