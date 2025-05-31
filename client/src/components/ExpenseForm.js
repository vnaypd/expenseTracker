import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpenseForm = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          description: '',
          amount: '',
          category: '',
          date: ''
     });
     const [categories, setCategories] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const token = localStorage.getItem('token');

                    // Fetch categories
                    const catRes = await axios.get('/categories', {
                         headers: { 'x-auth-token': token }
                    });
                    setCategories(catRes.data.categories || []);

                    // If in edit mode, fetch expense data
                    if (id) {
                         const expRes = await axios.get(`/expenses/${id}`, {
                              headers: { 'x-auth-token': token }
                         });

                         setFormData({
                              description: expRes.data.expense.description,
                              amount: expRes.data.expense.amount.toString(),
                              category: expRes.data.expense.category,
                              date: expRes.data.expense.date.split('T')[0]
                         });
                    }
               } catch (err) {
                    setError('Failed to load form data');
               }
          };

          fetchData();
     }, [id]);

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               setLoading(true);
               const token = localStorage.getItem('token');
               const expenseData = {
                    description: formData.description,
                    amount: parseFloat(formData.amount),
                    category: formData.category,
                    date: formData.date || new Date().toISOString()
               };

               if (id) {
                    await axios.put(`/expenses/${id}`, expenseData, {
                         headers: { 'x-auth-token': token }
                    });
               } else {
                    await axios.post('/expenses', expenseData, {
                         headers: { 'x-auth-token': token }
                    });
               }

               navigate('/expenses');
          } catch (err) {
               setError(err.response?.data?.message || 'Error saving expense');
          } finally {
               setLoading(false);
          }
     };

     const handleChange = (e) => {
          setFormData({
               ...formData,
               [e.target.name]: e.target.value
          });
     };

     return (
          <div className="expense-form">
               <h2>{id ? 'Edit Expense' : 'Add New Expense'}</h2>
               {error && <div className="alert alert-danger">{error}</div>}
               <form onSubmit={handleSubmit}>
                    <div className="form-group">
                         <label>Description</label>
                         <input
                              type="text"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              required
                         />
                    </div>
                    <div className="form-group">
                         <label>Amount (₹)</label>
                         <input
                              type="number"
                              name="amount"
                              value={formData.amount}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                              required
                         />
                    </div>
                    <div className="form-group">
                         <label>Category</label>
                         <select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                         >
                              <option value="">Select a category</option>
                              {categories.map(cat => (
                                   <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                   </option>
                              ))}
                         </select>
                    </div>
                    <div className="form-group">
                         <label>Date</label>
                         <input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                         />
                    </div>
                    <button
                         type="submit"
                         className="btn btn-primary"
                         disabled={loading}
                    >
                         {loading ? 'Saving...' : 'Save Expense'}
                    </button>
                    <button
                         type="button"
                         className="btn btn-secondary ml-2"
                         onClick={() => navigate('/expenses')}
                    >
                         Cancel
                    </button>
               </form>
          </div>
     );
};

export default ExpenseForm;