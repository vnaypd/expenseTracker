import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency, formatDate } from '../utils/helpers';

const ExpenseList = () => {
     const [expenses, setExpenses] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState('');

     useEffect(() => {
          const fetchExpenses = async () => {
               try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('/expenses', {
                         headers: { 'x-auth-token': token }
                    });
                    setExpenses(res.data.expenses || []);
               } catch (err) {
                    setError(err.response?.data?.message || 'Failed to fetch expenses');
               } finally {
                    setLoading(false);
               }
          };

          fetchExpenses();
     }, []);

     const deleteExpense = async (id) => {
          try {
               const token = localStorage.getItem('token');
               await axios.delete(`/expenses/${id}`, {
                    headers: { 'x-auth-token': token }
               });
               setExpenses(expenses.filter(expense => expense._id !== id));
          } catch (err) {
               setError('Failed to delete expense');
          }
     };

     if (loading) return <div className="loading">Loading expenses...</div>;
     if (error) return <div className="error">{error}</div>;

     return (
          <div className="expense-list">
               <h2>Your Expenses</h2>
               <Link to="/expenses/add" className="btn btn-primary mb-3">Add New Expense</Link>

               {expenses.length === 0 ? (
                    <p>No expenses found. Add your first expense!</p>
               ) : (
                    <table className="table">
                         <thead>
                              <tr>
                                   <th>Description</th>
                                   <th>Amount</th>
                                   <th>Category</th>
                                   <th>Date</th>
                                   <th>Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {expenses.map(expense => (
                                   <tr key={expense._id}>
                                        <td>{expense.description}</td>
                                        <td>{formatCurrency(expense.amount)}</td>
                                        <td className="text-capitalize">{expense.category}</td>
                                        <td>{formatDate(expense.date)}</td>
                                        <td>
                                             <Link
                                                  to={`/expenses/edit/${expense._id}`}
                                                  className="btn btn-sm btn-secondary"
                                             >
                                                  Edit
                                             </Link>
                                             <button
                                                  onClick={() => deleteExpense(expense._id)}
                                                  className="btn btn-sm btn-danger ml-2"
                                             >
                                                  Delete
                                             </button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               )}
          </div>
     );
};

export default ExpenseList;