
import React, { useEffect, useState } from 'react';
import { api, setToken, getToken } from './api';
import { askNotificationPermission, showNotification } from './notifications';


function LoginForm({ onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await api('/api/auth/login', 'POST', { email, password });
    setToken(res.token);
    onDone(res.user);
  };
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit} className="row">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}

function RegisterForm({ onDone }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await api('/api/auth/register', 'POST', { name, email, password });
    setToken(res.token);
    onDone(res.user);
  };
  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit} className="row">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button>Create account</button>
      </form>
    </div>
  );
}

function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const t = await api('/api/tasks', 'POST', { title, description, dueDate: dueDate || undefined });
    setTitle(''); setDescription(''); setDueDate('');
    onCreated(t);
  };
  return (
    <div className="card">
      <h2>Add task</h2>
      <form onSubmit={submit} className="row">
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <button>Add</button>
      </form>
    </div>
  );
}

function TaskItem({ t, onChange, onDelete }) {
  const toggle = async () => {
    const updated = await api(`/api/tasks/${t._id}/toggle`, 'PATCH');
    onChange(updated);
  };
  const save = async (fields) => {
    const updated = await api(`/api/tasks/${t._id}`, 'PUT', fields);
    onChange(updated);
  };
  const del = async () => {
    await api(`/api/tasks/${t._id}`, 'DELETE');
    onDelete(t._id);
  };
  return (
    <div className="card task">
      <div>
        <div className="task-title">{t.title} {t.completed ? <span className="badge">completed</span> : <span className="badge">pending</span>}</div>
        {t.description && <div>{t.description}</div>}
        {t.dueDate && <div>Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
      </div>
      <div className="actions">
        <button onClick={toggle}>{t.completed ? 'Mark pending' : 'Mark done'}</button>
        <button onClick={()=>{
          const title = prompt('New title', t.title) || t.title;
          const description = prompt('New description', t.description || '') || t.description;
          save({ title, description });
        }}>Edit</button>
        <button onClick={del}>Delete</button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = getToken();
    if (token) {
      // try to fetch tasks to validate token
      api('/api/tasks').then(() => setUser({})).catch(()=>{});
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    const q = filter === 'all' ? '' : `?status=${filter}`;
    api('/api/tasks' + q).then(setTasks);
  }, [filter, user]);

  if (!getToken()) {
    return (
      <div className="container">
        <h1>Task Manager</h1>
        <RegisterForm onDone={setUser} />
        <LoginForm onDone={setUser} />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="row">
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={()=>{ localStorage.removeItem('token'); setUser(null); }}>Logout</button>
      </div>
      <TaskForm onCreated={(t)=>setTasks(prev=>[t, ...prev])} />
      {tasks.map(t => <TaskItem key={t._id} t={t} onChange={(u)=>setTasks(prev=>prev.map(x=>x._id===u._id?u:x))} onDelete={(id)=>setTasks(prev=>prev.filter(x=>x._id!==id))} />)}
    </div>
  );
}

