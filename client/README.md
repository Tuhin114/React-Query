# React + Vite

- `npm i @tanstack/react-query`
- `npm i @tanstack/react-query-devtools`
- `npm i json-server`
- `npx json-server src/api/data.json`

- See React-Query docs and there useQuery to see multiple options

## Note - 1

This React component demonstrates how to use `react-query` to fetch data from an API and handle different states (loading, success, error) within your application.

### Code Explanation

#### Imports

```javascript
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "./api/api";
```

- **React:** Used to create the component.
- **useQuery:** A hook provided by `@tanstack/react-query` to fetch data and manage the server state.
- **fetchPosts:** A function imported from the `./api/api` file that handles the actual API call to fetch posts.

#### App Component

```javascript
const App = () => {
  const { data, isLoading, status } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  console.log(data, isLoading, status);
  return <div>Hello</div>;
};

export default App;
```

1. **useQuery Hook:**
   - The `useQuery` hook is used to fetch data and manage the state of the request.
   - **`queryKey`:** A unique key (`["posts"]`) that identifies the query. This helps `react-query` cache and manage the state of this particular request.
   - **`queryFn`:** The function (`fetchPosts`) that will be called to fetch the data. This function is typically defined in a separate file (`./api/api` in this case) and handles the actual API request.

2. **Destructured Return Values:**
   - **`data`:** This contains the data returned by the `fetchPosts` function once the request is successful.
   - **`isLoading`:** A boolean that indicates whether the data is still being fetched.
   - **`status`:** A string that indicates the current status of the query (`"loading"`, `"error"`, or `"success"`).

3. **Logging the Values:**
   - The component logs `data`, `isLoading`, and `status` to the console for debugging purposes. This allows you to see the state of the data fetching process in the browser's console.

4. **Rendering:**
   - The component currently renders a simple `<div>` with the text "Hello". This is where you would typically display the fetched data or handle the loading and error states.

### Example of `fetchPosts` Function

For a complete understanding, here's an example of what the `fetchPosts` function might look like:

```javascript
// ./api/api.js

const fetchPosts = async (page) => {
  const response = await fetch(
    `http://localhost:3000/posts?_sort=-id&${
      page ? `_page=${page}&_per_page=5` : ""
    }`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts. Status: ${response.status}`);
  }

  const postData = await response.json();
  return postData;
};
```

- **fetchPosts:** An asynchronous function that fetches data from an API endpoint (e.g., JSONPlaceholder). If the request fails, it throws an error, which `react-query` will handle.

### How It Works

1. When the `App` component renders, the `useQuery` hook triggers the `fetchPosts` function to fetch the data.
2. While the data is being fetched, `isLoading` will be `true`, and the `status` will be `"loading"`.
3. Once the data is successfully fetched, `data` will contain the fetched posts, `isLoading` will be `false`, and `status` will be `"success"`.
4. If an error occurs, `status` will be `"error"`.

You can enhance the component by conditionally rendering UI elements based on these states. For instance, you could show a loading spinner while `isLoading` is `true`, or display an error message if the status is `"error"`.

## Note - 2

Here's a detailed explanation of the `PostList` component:

### Component Overview

This React component uses `react-query` to fetch a list of posts and display them. It handles loading, error, and empty states gracefully. Each post includes a title and tags, which are also displayed.

### Code Breakdown

#### Imports

```javascript
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";
```

- **React:** The main React library for creating components.
- **useQuery:** A hook from `@tanstack/react-query` used for data fetching and state management.
- **fetchPosts:** A function that handles the API request to fetch posts. It's imported from the `../api/api` file.

#### PostList Component

```javascript
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
```

1. **useQuery Hook:**
   - **queryKey:** A unique key (`["posts"]`) for identifying the query. This key helps in caching and refetching data when necessary.
   - **queryFn:** The function (`fetchPosts`) that fetches the data. This function handles the actual API call and returns the posts.

2. **Destructured Values:**
   - **`data: postData = []`:** The `data` from the query is renamed to `postData`. If no data is returned, it defaults to an empty array.
   - **`isError`:** A boolean that indicates whether there was an error during data fetching.
   - **`isLoading`:** A boolean that indicates whether the data is currently being loaded.
   - **`error`:** The error object returned if the query fails.

#### Rendering the UI

```javascript
  return (
    <div className="container">
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {postData.length === 0 && !isLoading && !isError && <p>No posts available.</p>}
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
```

1. **Container:** The entire component is wrapped in a `<div>` with a `container` class.

2. **Loading State:**
   - If `isLoading` is `true`, it displays "Loading...".

3. **Error State:**
   - If `isError` is `true`, it displays the error message from the `error` object.

4. **Empty State:**
   - If there are no posts (`postData.length === 0`), and the data is not loading or in error, it displays "No posts available."

5. **Displaying Posts:**
   - The component maps over `postData` and renders each post inside a `<div>` with a `post` class.
   - Each post's title is displayed inside a `<div>`.
   - Each post's tags are also mapped and displayed as `<span>` elements inside a nested `<div>`. The `key` prop for tags ensures that each tag is uniquely identified within its post.

#### Example of `fetchPosts` Function

For context, here's a sample implementation of the `fetchPosts` function:

```javascript
// ../api/api.js

export const fetchPosts = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const posts = await response.json();
  
  // Assuming that each post has a "tags" field for this example.
  return posts.map(post => ({
    ...post,
    tags: post.tags || [], // Ensure every post has a tags array
  }));
};
```

- **fetchPosts:** This function fetches posts from an API. The returned posts include a `tags` field, which is ensured to be an array, even if it's empty.

### How It Works

1. **Data Fetching:**
   - When `PostList` is rendered, the `useQuery` hook triggers the `fetchPosts` function to fetch the list of posts.

2. **Conditional Rendering:**
   - The component checks if data is loading (`isLoading`), if there's an error (`isError`), or if the data is empty (`postData.length === 0`). Based on these conditions, it renders appropriate messages.

3. **Display Posts:**
   - If there are posts available, the component maps over `postData` and displays each post's title and tags.

This component structure is typical in modern React applications where you need to handle various states (loading, error, success) efficiently and display dynamic content based on the fetched data.

## Note - 3

Let's compare the updated code with the previous version and explain the new or modified parts.

### 1. **New API Function Imports**

```javascript
import { addPost, fetchPosts, fetchTags } from "../api/api";
```

- **addPost:** A new function added to handle the creation of a new post.
- **fetchTags:** A new function added to fetch available tags from the API.

### 2. **Fetching Tags Data with useQuery**

```javascript
const { data: tagsData } = useQuery({
  queryKey: ["tags"],
  queryFn: fetchTags,
});
```

- This new `useQuery` hook is used to fetch tags data from the server.
- **`queryKey`:** The unique identifier for the query is `["tags"]`.
- **`queryFn`:** This calls the `fetchTags` function to retrieve the tags.

### 3. **useMutation for Adding a Post**

```javascript
const {
  mutate,
  isError: isPostError,
  isPending,
  error: postError,
} = useMutation({
  mutationFn: addPost,
});
```

- **useMutation:** This hook is used to perform a mutation, which in this case is adding a new post.
- **`mutationFn`:** The function (`addPost`) that will be called to add a new post.
- **`mutate`:** This function is used to trigger the mutation.
- **`isError: isPostError`:** A boolean that indicates whether there was an error when trying to add a post.
- **`isPending`:** A boolean that indicates whether the mutation is in progress.
- **`error: postError`:** The error object returned if the mutation fails.

### 4. **Form Handling with handleSubmit**

```javascript
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
```

- **handleSubmit:** A new function to handle the form submission.
  - **`e.preventDefault()`** prevents the default form submission behavior.
  - **`new FormData(e.target)`** collects all form data.
  - **title:** Extracts the value of the "title" input.
  - **tags:** Filters the form data keys to collect the selected tags (those with a value of `"on"`).
  - **mutate:** Triggers the `addPost` mutation with a new post object containing the `id`, `title`, and `tags`.
  - **`e.target.reset()`** resets the form after submission.

### 5. **Form UI and Submission Logic**

```javascript
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
```

- **Form Structure:** A new form is introduced for creating a new post.
  - **Input Field:** An input field is used to enter the post title.
  - **Tags Section:** Dynamically generates checkboxes for each tag fetched from `tagsData`.
  - **Error Handling:** If there's an error in posting, an error message is displayed.
  - **Button:** The submit button is disabled while the post is being added (`isPending`).

### 6. **Post List Display (Updated Only)**

```javascript
{postData.map((post) => (
  <div key={post.id} className="post">
    <div>{post.title}</div>
    {post.tags.map((tag) => (
      <span key={tag}>{tag}</span>
    ))}
  </div>
))}
```

- **Post Tags:** The tags for each post are now displayed as `<span>` elements within each post.

### Summary of Changes

- **API Functions:** Added `addPost` and `fetchTags` for handling post creation and fetching tags.
- **Tag Fetching:** Introduced `useQuery` for fetching tags.
- **Post Creation:** Added form handling logic with `useMutation` for adding a new post, including handling the form submission, collecting tags, and managing form state.
- **UI Updates:** Added form elements for entering post titles and selecting tags, with dynamic tag rendering and form reset logic.

These changes introduce the ability to create posts with associated tags and handle various states (e.g., posting, errors) while keeping the UI responsive and interactive.

## Note - 4

Let's compare the latest code with the previous version and focus on the newly added or updated parts.

### 1. **Introduction of useQueryClient**

```javascript
const queryClient = useQueryClient();
```

- **useQueryClient:** This hook provides access to the `QueryClient`, allowing you to manually interact with the query cache. In this context, it's being used to invalidate queries after a successful mutation, ensuring the UI stays in sync with the latest data.

### 2. **Enhancements to useMutation**

The `useMutation` hook has been enhanced with the `onMutate` and `onSuccess` callbacks.

#### onMutate

```javascript
onMutate: () => {
  return { id: 1 };
},
```

- **onMutate:** This callback is triggered before the mutation function (`addPost`) is executed. It allows you to optimistically update the UI or return a context object that can be used in later callbacks.
- **Return Value:** Here, it returns an object with an `id` of `1`, which will be passed to the `onSuccess` callback as the `context`.

#### onSuccess

```javascript
onSuccess: (data, variables, context) => {
  console.log(data, variables, context);
  queryClient.invalidateQueries({
    queryKey: ["posts"],
    exact: true,
    predicate: (query) =>
      query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,
  });
},
```

- **onSuccess:** This callback is executed after the mutation succeeds. It provides access to the mutation's result (`data`), the variables used in the mutation (`variables`), and the context returned from `onMutate` (`context`).
  - **Logging:** The `data`, `variables`, and `context` are logged to the console, which can be useful for debugging or monitoring the mutation's outcome.
  - **invalidateQueries:** This method is used to invalidate specific queries in the cache. Here, it's configured to invalidate the `"posts"` query, but only if the query key's first element is `"posts"` and the second element's `page` property is `>= 2`. This ensures that the cache is updated only for the relevant queries.

### Summary of Changes

- **useQueryClient:** Introduced to manually interact with the query cache.
- **onMutate:** Added to optimistically update the UI or prepare context data before the mutation is executed.
- **onSuccess:** Enhanced to log mutation results and invalidate specific queries in the cache based on custom logic.

These changes add more robust handling around the mutation process, allowing for optimistic UI updates and fine-grained control over query invalidation.
