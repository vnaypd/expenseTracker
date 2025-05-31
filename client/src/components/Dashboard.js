import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCards from './SummaryCards';
import ExpenseChart from './ExpenseChart';
import RecentExpenses from './RecentExpenses';

const Dashboard = () => {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const fetchDashboardData = async () => {
          try {
               setLoading(true);
               setError(null);

               const token = localStorage.getItem('token');
               const response = await axios.get('/expenses/summary', {
                    headers: { 'x-auth-token': token },
                    timeout: 10000 // 10 second timeout
               });

               if (response.data?.success) {
                    setData(response.data.data);
               } else {
                    throw new Error(response.data?.message || 'Invalid response format');
               }
          } catch (err) {
               setError({
                    message: err.response?.data?.message ||
                         err.message ||
                         'Failed to load dashboard data',
                    isRetryable: !err.response || err.response.status >= 500
               });
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchDashboardData();
     }, []);

     if (loading) {
          return (
               <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your financial dashboard...</p>
               </div>
          );
     }

     if (error) {
          return (
               <div className="dashboard-error">
                    <h3>We couldn't load your dashboard</h3>
                    <p>{error.message}</p>
                    {error.isRetryable && (
                         <button
                              onClick={fetchDashboardData}
                              className="retry-button"
                         >
                              Try Again
                         </button>
                    )}
               </div>
          );
     }

     return (
          <div className="dashboard">
               <header className="dashboard-header">
                    <h1>Financial Overview</h1>
                    <button
                         onClick={fetchDashboardData}
                         className="refresh-button"
                    >
                         Refresh Data
                    </button>
               </header>

               {data && (
                    <>
                         <SummaryCards totals={data.totals} />

                         <div className="dashboard-grid">
                              <div className="chart-container">
                                   <h2>Spending by Category</h2>
                                   <ExpenseChart categoryData={data.byCategory} />
                              </div>

                              <div className="recent-expenses-container">
                                   <h2>Recent Transactions</h2>
                                   <RecentExpenses expenses={data.recentExpenses} />
                              </div>
                         </div>
                    </>
               )}
          </div>
     );
};

export default Dashboard;