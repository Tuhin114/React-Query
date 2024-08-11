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
