import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";

const PostList = () => {
  const {
    data: postData = [], // Default to an empty array
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="container">
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {postData.length === 0 && !isLoading && !isError && (
        <p>No posts available.</p>
      )}
      {postData.map((post) => (
        <div key={post.id} className="post">
          <div>{post.title}</div>
          <div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
