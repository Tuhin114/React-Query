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

## Note - 5

Let's focus on the newly added or modified parts of the code:

### 1. **Introduction of the `reset` Method in `useMutation`**

```javascript
const {
  mutate,
  isError: isPostError,
  isPending,
  error: postError,
  reset, 
} = useMutation({
  // Mutation configuration
});
```

- **reset:** This method is provided by the `useMutation` hook. It allows you to reset the mutation state, typically used to clear error states or reset the `isLoading` and `isError` flags after a mutation attempt. This is particularly useful in cases where you want to give users the ability to retry an operation or clear an error message.

### 2. **Usage of the `reset` Method in the Form**

```javascript
{isPostError && <h5 onClick={() => reset()}>Unable to Post</h5>}
```

- **Error Handling with `reset`:** In the form, if a post attempt fails (`isPostError` is true), an error message is displayed with a clickable `<h5>` element. When clicked, it triggers the `reset` function, which resets the mutation's state, effectively clearing the error and allowing the user to attempt the action again without the error persisting.

### 3. **Commented Out Sections in `useMutation`**

```javascript
// predicate: (query) =>
//   query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,

// onError: (error, variables, context) => {
//   console.error(error, variables, context);
// },

// onSettled: (data, error, variables, context) => {},
```

- **Predicate (Commented Out):** This part, which was intended to filter and invalidate specific queries based on conditions, has been commented out. This suggests that for now, the code invalidates the entire `"posts"` query without the additional filtering.
  
- **onError (Commented Out):** This callback would handle errors that occur during the mutation, logging them or taking additional steps based on the context. It's commented out, meaning the current code does not explicitly handle mutation errors in this manner, potentially relying on the `reset` method instead.

- **onSettled (Commented Out):** This callback runs after the mutation is either successfully completed or fails. It’s useful for clean-up tasks or final operations regardless of the mutation outcome. Since it's commented out, it indicates that such a final step isn’t currently needed.

### Summary of Changes

- **reset Method:** Introduced to allow resetting the mutation state after an error, providing users with a better experience by clearing errors and allowing retries.
- **Commented Sections:** These include a predicate for query invalidation, error handling, and a final settlement callback, all of which are currently disabled, suggesting that the current focus is on basic mutation and query invalidation without complex error or state management.

## Note - 6

In this updated code, there are a few notable changes and additions that enhance the functionality and performance of the `PostList` component. Here's an explanation of the new or updated parts:

### 1. **Introduction of `gcTime` in the `posts` Query**

```javascript
const {
  data: postData = [],
  isError,
  isLoading,
  error,
} = useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  gcTime: 0,
  refetchInterval: 1000 * 5,
});
```

- **gcTime (Garbage Collection Time):** The `gcTime` option is set to `0`, meaning the query's cached data will not be garbage collected automatically. This essentially keeps the data in the cache indefinitely unless manually removed or invalidated. This can be useful if you want to keep the data accessible without needing to re-fetch it, especially if the data is expected to be reused frequently.

- **refetchInterval:** This option is set to `1000 * 5` (5 seconds), meaning the `fetchPosts` query will automatically refetch the data every 5 seconds. This is useful in scenarios where the data is expected to change frequently and you want to keep the UI in sync with the latest data without requiring a manual refresh.

### 2. **Introduction of `staleTime` in the `tags` Query**

```javascript
const { data: tagsData } = useQuery({
  queryKey: ["tags"],
  queryFn: fetchTags,
  staleTime: Infinity,
});
```

- **staleTime:** The `staleTime` is set to `Infinity`, meaning that the fetched tags data will never be considered stale. This implies that the data won't be refetched once it is loaded unless explicitly invalidated. This is ideal for data that is either static or rarely changes, such as a predefined set of tags.

### Summary of Changes

- **gcTime:** Configured for the `posts` query to prevent automatic garbage collection, keeping the data in cache indefinitely.
  
- **refetchInterval:** Added to the `posts` query to enable automatic data refetching every 5 seconds, ensuring the UI displays the most up-to-date information.
  
- **staleTime:** Set to `Infinity` for the `tags` query, ensuring that the tags data is not refetched and remains fresh indefinitely unless manually invalidated.

These changes optimize how frequently data is fetched and retained, balancing the need for fresh data with performance considerations, particularly by reducing unnecessary refetches for static or infrequently changing data.

## Note - 7

In this updated version of the code, the new additions focus primarily on implementing pagination for the list of posts. Here's a breakdown of the new or updated parts:

### 1. **State for Pagination (`useState`):**

   ```javascript
   const [page, setPage] = useState(1);
   ```

- A new piece of state, `page`, is introduced to keep track of the current page number. The initial page is set to `1`.

### 2. **Query Key with Page (`useQuery`):**

   ```javascript
   queryKey: ["posts", page],
   queryFn: () => fetchPosts(page),
   ```

- The `queryKey` now includes the `page` number. This ensures that the query is unique for each page, allowing React Query to handle the data separately for different pages.
- The `queryFn` is modified to pass the `page` as an argument to `fetchPosts`, enabling the fetching of posts specific to that page.

### 3. **`keepPreviousData` Option:**

   ```javascript
   keepPreviousData: true,
   ```

- This option is set to `true` to prevent flickering and maintain the previous page’s data while the new page data is being fetched. This provides a smoother user experience during pagination transitions.

### 4. **Pagination Controls:**

   ```javascript
   <div className="pages">
     <button
       onClick={() => setPage((old) => Math.max(old - 1, 1))}
       disabled={page === 1}
     >
       Previous Page
     </button>
     <span>{page}</span>
     <button
       onClick={() => {
         if (!isPreviousData && postData?.next) {
           setPage((old) => old + 1);
         }
       }}
       disabled={isPreviousData || !postData?.next}
     >
       Next Page
     </button>
   </div>
   ```

- **Previous Page Button:** Decreases the `page` state by 1, with a minimum value of `1`. The button is disabled on the first page.
- **Next Page Button:** Increases the `page` state by 1 if the data is not from a previous fetch (`!isPreviousData`) and if there is a next page (`postData?.next`).
- **Page Display:** The current page number is displayed between the buttons.

### 5. **Handling `isPreviousData`:**

   ```javascript
   isPreviousData,
   ```

- `isPreviousData` is a boolean provided by React Query that indicates if the data being shown is from a previous fetch while the new data is being loaded. This is useful for disabling the "Next Page" button while awaiting fresh data for the new page.

### Summary

These changes effectively add pagination to the `PostList` component, allowing users to navigate through different pages of posts while ensuring a smooth data-loading experience. The `keepPreviousData` option is crucial for maintaining a consistent UI during pagination, and the state-driven page controls ensure that the correct data is fetched and displayed for each page.
