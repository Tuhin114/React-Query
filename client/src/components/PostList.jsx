import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";

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

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    isError: isPostError,
    isPending,
    error: postError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variables, context) => {
      console.log(data, variables, context);
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        // predicate: (query) =>
        //   query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,
      });
    },
    // onError: (error, variables, context) => {
    //   console.error(error, variables, context);
    // },
    // onSettled: (data, error, variables, context) => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );

    if (!title || !tags) return;

    mutate({ id: postData?.items + 1, title, tags });

    e.target.reset(); // reset form
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        {isPostError && <h5 onClick={() => reset()}>Unable to Post</h5>}
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {postData.length === 0 && !isLoading && !isError && (
        <p>No posts available.</p>
      )}
      {postData.map((post) => (
        <div key={post.id} className="post">
          <div>{post.title}</div>

          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PostList;
