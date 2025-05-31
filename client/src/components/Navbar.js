import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout, user }) => {
     return (
          <nav className="navbar">
               <div className="container">
                    <Link to="/" className="navbar-brand">Expense Tracker</Link>
                    <div className="navbar-nav">
                         {isAuthenticated ? (
                              <>
                                   <span className="nav-link">Welcome, {user?.email}</span>
                                   <Link to="/" className="nav-link">Dashboard</Link>
                                   <Link to="/expenses" className="nav-link">Expenses</Link>
                                   <Link to="/categories" className="nav-link">Categories</Link>
                                   <button onClick={logout} className="btn btn-link nav-link">Logout</button>
                              </>
                         ) : (
                              <>
                                   <Link to="/login" className="nav-link">Login</Link>
                                   <Link to="/register" className="nav-link">Register</Link>
                              </>
                         )}
                    </div>
               </div>
          </nav>
     );
};

export default Navbar;