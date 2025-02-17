import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTodoContext } from "../contexts/TodoContext";
import styles from "./TodoDetail.module.css";

export const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { todos, updateTodo, toggleTodo } = useTodoContext();

  const todo = todos.find((t) => t.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");

  if (!todo) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Todo not found</h1>
          <Link to="/" className={styles.backButton}>
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    updateTodo(todo.id, {
      title: title.trim(),
      description: description.trim(),
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Todo Details</h1>
        <Link to="/" className={styles.backButton}>
          Back to List
        </Link>
      </div>
      <div className={styles.content}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle(todo.title);
                  setDescription(todo.description);
                  setIsEditing(false);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className={styles.todoTitle}>{todo.title}</h2>
            <p className={styles.description}>{todo.description}</p>
            <div className={styles.meta}>
              <div className={styles.status}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className={styles.checkbox}
                />
                <span>
                  Status: {todo.completed ? "Completed" : "In Progress"}
                </span>
              </div>
              <div>
                Created: {formatDate(todo.createdAt)}
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
