import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

const RecentExpenses = ({ expenses }) => {
     return (
          <div className="recent-expenses">
               <h3>Recent Expenses</h3>
               {expenses.length > 0 ? (
                    <ul>
                         {expenses.map(expense => (
                              <li key={expense._id}>
                                   <div className="expense-item">
                                        <span className="description">{expense.description}</span>
                                        <span className="amount">{formatCurrency(expense.amount)}</span>
                                        <span className="category">{expense.category}</span>
                                        <span className="date">{formatDate(expense.date)}</span>
                                   </div>
                              </li>
                         ))}
                    </ul>
               ) : (
                    <p>No recent expenses</p>
               )}
          </div>
     );
};

export default RecentExpenses;