import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TodoProvider } from "./contexts/TodoContext";
import { TodoList } from "./pages/TodoList";
import { TodoNew } from "./pages/TodoNew";
import { TodoDetail } from "./pages/TodoDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TodoList />,
  },
  {
    path: "/new",
    element: <TodoNew />,
  },
  {
    path: "/:id",
    element: <TodoDetail />,
  },
]);

export const App = () => {
  return (
    <TodoProvider>
      <RouterProvider router={router} />
    </TodoProvider>
  );
};
