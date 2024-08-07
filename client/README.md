# React + Vite

- `npm i @tanstack/react-query`
- `npm i @tanstack/react-query-devtools`

## Note 1

Here's a detailed explanation of the provided code:

### Code Overview

This React component uses `react-query` for managing server state, specifically for fetching and mutating data related to posts. The component displays a list of posts and includes a button to add a new post. It handles loading states and errors during data fetching and mutation.

### Dependencies

- `react`: The React library for building the user interface.
- `@tanstack/react-query`: A powerful data-fetching and state management library for React applications.

### Components and Hooks

#### `App` Component

1. **Query Client Initialization:**

   ```javascript
   const queryClient = useQueryClient();
   ```

   - This hook returns the `QueryClient` instance, which is essential for invalidating queries and managing the cache.

2. **Fetching Posts with `useQuery`:**

   ```javascript
   const postsQuery = useQuery({
     queryKey: ["posts"],
     queryFn: () => wait(1000).then(() => [...POSTS]),
   });
   ```

   - **`queryKey`:** A unique key (`["posts"]`) to identify the query.
   - **`queryFn`:** The function that fetches the data. In this case, it simulates a delay of 1000ms using `wait` and then returns the `POSTS` array.

3. **Handling Loading and Error States:**

   ```javascript
   if (postsQuery.isLoading) return <h1>Loading...</h1>;
   if (postsQuery.error) return <pre>{JSON.stringify(postsQuery.error)}</pre>;
   ```

   - If the query is still loading, a loading message is displayed.
   - If there is an error, it is displayed in a formatted way using `<pre>`.

4. **Displaying Posts:**

   ```javascript
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
   ```

   - The fetched posts are mapped and displayed. Each post is rendered inside a `<div>` with its `title`.
   - A button is provided to add a new post. It is disabled when the mutation is in progress.

5. **Adding a New Post with `useMutation`:**

   ```javascript
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
   ```

   - **`mutationFn`:** This function adds a new post. It simulates a delay of 1000ms using `wait` and then adds a new post with a unique ID (`crypto.randomUUID()`) and the provided `title`.
   - **`onSuccess`:** This callback is triggered when the mutation is successful. It invalidates the `["posts"]` query, causing it to refetch and update the UI with the new post.

#### `wait` Function

```javascript
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
```

- This utility function returns a promise that resolves after a specified duration (in milliseconds). It is used to simulate network delays in the `queryFn` and `mutationFn`.

### How It Works

1. **Initial Render:**
   - The `useQuery` hook fetches the posts, and while it's loading, "Loading..." is displayed.

2. **Data Loaded:**
   - Once the data is loaded, the posts are displayed. Each post's title is shown in a `<div>`.

3. **Adding a New Post:**
   - When the "Add New" button is clicked, the `newPostMutation` is triggered. It simulates a delay and adds a new post to the `POSTS` array.
   - On success, the posts query is invalidated, causing it to refetch and display the updated list, including the new post.

### Key Concepts

- **React Query:** Efficiently handles server state and provides hooks (`useQuery`, `useMutation`, `useQueryClient`) to manage data fetching, caching, and synchronization.
- **Loading and Error States:** Proper handling ensures a smooth user experience during data fetching and error conditions.
- **Mutation and Invalidating Queries:** Mutations allow updating data on the server, and invalidating queries ensures the UI stays in sync with the server state.
