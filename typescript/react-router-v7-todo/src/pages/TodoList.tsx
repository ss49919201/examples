import { Link } from "react-router-dom";
import { useTodoContext } from "../contexts/TodoContext";
import styles from "./TodoList.module.css";

export const TodoList = () => {
  const { todos, toggleTodo, deleteTodo } = useTodoContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Todo List</h1>
        <Link to="/new" className={styles.addButton}>
          Add Todo
        </Link>
      </div>
      {todos.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No todos yet</h2>
          <p>Click the "Add Todo" button to create your first todo!</p>
        </div>
      ) : (
        <ul className={styles.todoList}>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.todoItem}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className={styles.checkbox}
              />
              <Link
                to={`/${todo.id}`}
                className={`${styles.todoTitle} ${
                  todo.completed ? styles.completed : ""
                }`}
              >
                {todo.title}
              </Link>
              <button
                onClick={() => deleteTodo(todo.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
