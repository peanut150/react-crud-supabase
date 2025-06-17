import { useEffect, useState } from 'react'
import './App.css'
import supabase from './supabase-client'

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    const { data, error } = await supabase
      .from("todolist")
      .select("*");

    if (error) {
      console.error("Error fetching todo list: ", error)
    } else {
      setTodoList(data)
    }
  };

  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("todolist")
      .insert([newTodoData])
      .single();

    if (error) {
      console.error("Error adding todo: ", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo("");
    }
  };

  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("todolist")
      .update({isCompleted: !isCompleted})
      .eq("id", id);

    if (error) {
      console.error("Error toggling task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };

  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("todolist")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder='New Todo...'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo Item</button>
      </div>

      <ul>
        {todoList.map((todo) => (
          <li>
            <p>{todo.name}</p>
            <button onClick={() => completeTask(todo.id, todo.isCompleted)}>{todo.isCompleted ? "Undo" : "Complete Task"}</button>
            <button onClick={() => deleteTask(todo.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
