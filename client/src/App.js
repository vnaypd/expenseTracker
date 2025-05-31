import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import Navbar from './components/Navbar';
import './App.css';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const res = await axios.get('/users/verify', {
          headers: { 'x-auth-token': token }
        });

        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const setAuth = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.get('/users/logout');
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/login';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <div className="container">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/expenses" element={isAuthenticated ? <ExpenseList /> : <Navigate to="/login" />} />
            <Route path="/expenses/add" element={isAuthenticated ? <ExpenseForm /> : <Navigate to="/login" />} />
            <Route path="/expenses/edit/:id" element={isAuthenticated ? <ExpenseForm /> : <Navigate to="/login" />} />
            <Route path="/categories" element={isAuthenticated ? <CategoryManager /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;