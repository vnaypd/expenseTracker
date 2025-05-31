import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ setAuth }) => {
     const [formData, setFormData] = useState({
          email: '',
          password: '',
          confirmPassword: ''
     });
     const [error, setError] = useState('');
     const navigate = useNavigate();

     const { email, password, confirmPassword } = formData;

     const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

     const onSubmit = async e => {
          e.preventDefault();
          if (password !== confirmPassword) {
               setError('Passwords do not match');
               return;
          }
          try {
               const res = await axios.post('/users/register', { email, password });
               setAuth(res.data.token);
               navigate('/');
          } catch (err) {
               setError(err.response?.data?.message || 'Registration failed');
          }
     };

     return (
          <div className="auth-form">
               <h2>Register</h2>
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
                         />
                    </div>
                    <div className="form-group">
                         <label>Confirm Password</label>
                         <input
                              type="password"
                              name="confirmPassword"
                              value={confirmPassword}
                              onChange={onChange}
                              required
                              minLength="6"
                         />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
               </form>
          </div>
     );
};

export default Register;