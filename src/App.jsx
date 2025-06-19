import { useEffect, useState } from 'react'
import './App.css'
import supabase from './supabase-client'

function App() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      const { data, error } = await supabase
        .from("todolist")
        .select("*");

      if (error) {
        console.error("Error fetching to-do list: ", error);
      } else {
        setTodoList(data);
      }
    } catch (e) {
      console.error("An unexpected error occurred: ", e);
    }
  };

  const addTodo = async () => {
    try {
      const newTodoData = {
        title: title,
        status: false,
      };

      const { data, error } = await supabase
        .from("todolist")
        .insert([newTodoData])
        .single();

      if (error) {
        console.error("Error adding to-do: ", error);
      } else {
        setTodoList((prev) => [...prev, data]);
        setTitle("");
      }
    } catch (e) {
      console.error("An unexpected error occurred: ", e);
    }
  };

  const toggleTodoStatus = async (id, status) => {
    try {
      const { data, error } = await supabase
        .from("todolist")
        .update({status: !status})
        .eq("id", id);

      if (error) {
        console.error("Error toggling to-do status: ", error);
      } else {
        const updatedTodoList = todoList.map((todo) =>
          todo.id === id ? { ...todo, status: !status } : todo
        );

        setTodoList(updatedTodoList);
      }
    } catch (e) {
      console.error("An unexpected error occurred: ", e);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { data, error } = await supabase
        .from("todolist")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting to-do: ", error);
      } else {
        setTodoList((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (e) {
      console.error("An unexpected error occurred: ", e);
    }
  };

  return (
    <>
      <h1>To-do List</h1>
      <div>
        <input
          type="text"
          placeholder='Enter title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>
          Add
        </button>
      </div>

      <ul>
        {todoList.map((todo) => (
          todo && todo.title ? (
            <li key={todo.id}>
              <p>{todo.title}</p>
              <p>{todo.date_added}</p>
              <p>{todo.date_completed ? todo.date_completed : ""}</p>
              <button onClick={() => toggleTodoStatus(todo.id, todo.status)}>
                {todo.status ? "Undo Task" : "Complete Task"}
              </button>
              <button onClick={() => deleteTodo(todo.id)}>
                Delete Task
              </button>
            </li>
          ) : null
        ))}
      </ul>
    </>
  );
};

export default App
