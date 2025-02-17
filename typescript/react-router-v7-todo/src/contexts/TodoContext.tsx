import { createContext, useContext, ReactNode } from "react";
import { Todo } from "../types/todo";
import { useTodos } from "../hooks/useTodos";

type TodoContextType = {
  todos: Todo[];
  addTodo: (title: string, description: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const todoUtils = useTodos();

  return (
    <TodoContext.Provider value={todoUtils}>{children}</TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
