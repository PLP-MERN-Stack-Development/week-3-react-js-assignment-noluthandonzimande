/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default <App></App>

*/

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500 text-white">
      <h1 className="text-3xl font-bold">Tailwind is working! 🚀</h1>
    </div>
  );
}

export default App;
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-300 text-gray-900 hover:bg-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-900">
      <div className="text-xl font-bold">MyApp</div>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/api-data" className="hover:underline">API Data</Link></li>
      </ul>
      <ThemeSwitcher />
    </nav>
  );
}
export default function Footer() {
  return (
    <footer className="p-4 bg-gray-200 dark:bg-gray-900 text-center text-sm text-gray-700 dark:text-gray-300">
      &copy; {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className="px-2 py-1 border rounded"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Button from './Button';

export default function TaskManager() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [taskInput, setTaskInput] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  function addTask() {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now(), text: taskInput.trim(), completed: false }]);
      setTaskInput('');
    }
  }

  function toggleComplete(id) {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Task Manager</h2>

      <div className="flex space-x-2 mb-4">
        <input
          className="flex-grow p-2 border rounded"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="New task"
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask}>Add</Button>
      </div>

      <div className="mb-4 space-x-2">
        {['all', 'active', 'completed'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <ul>
        {filteredTasks.length === 0 && <li>No tasks found</li>}
        {filteredTasks.map(({ id, text, completed }) => (
          <li
            key={id}
            className="flex items-center justify-between p-2 border-b"
          >
            <label className={`flex items-center space-x-2 cursor-pointer ${completed ? 'line-through text-gray-400' : ''}`}>
              <input
                type="checkbox"
                checked={completed}
                onChange={() => toggleComplete(id)}
              />
              <span>{text}</span>
            </label>
            <Button variant="danger" onClick={() => deleteTask(id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}


