import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAuth }) => {
     const [formData, setFormData] = useState({
          email: '',
          password: ''
     });
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const { email, password } = formData;

     const onChange = e => {
          setFormData({
               ...formData,
               [e.target.name]: e.target.value
          });
     };

     const onSubmit = async e => {
          e.preventDefault();
          setLoading(true);
          setError('');

          try {
               const res = await axios.post('/users/login', {
                    email: email.toLowerCase(),
                    password
               });

               setAuth(res.data.token, res.data.user);
               navigate('/');
          } catch (err) {
               setError(err.response?.data?.message || 'Login failed. Please try again.');
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="auth-form">
               <h2>Login</h2>
               {error && <div className="alert alert-danger">{error}</div>}
               <form onSubmit={onSubmit}>
                    <div className="form-group">
                         <label>Email</label>
                         <input
                              type="email"
                              name="email"
                              value={email}
                              onChange={onChange}
                              required
                              autoComplete="username"
                         />
                    </div>
                    <div className="form-group">
                         <label>Password</label>
                         <input
                              type="password"
                              name="password"
                              value={password}
                              onChange={onChange}
                              required
                              minLength="6"
                              autoComplete="current-password"
                         />
                    </div>
                    <button
                         type="submit"
                         className="btn btn-primary"
                         disabled={loading}
                    >
                         {loading ? 'Logging in...' : 'Login'}
                    </button>
               </form>
          </div>
     );
};

export default Login;