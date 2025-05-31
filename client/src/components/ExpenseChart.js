import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ categoryData }) => {
     // Validate and transform the category data
     const getChartData = () => {
          if (!categoryData || typeof categoryData !== 'object') {
               return {
                    labels: ['No Data'],
                    datasets: [{
                         data: [1],
                         backgroundColor: ['#cccccc']
                    }]
               };
          }

          const categories = Object.keys(categoryData);
          const amounts = Object.values(categoryData);

          return {
               labels: categories,
               datasets: [{
                    data: amounts,
                    backgroundColor: [
                         '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                         '#9966FF', '#FF9F40', '#8AC24A'
                    ],
               }]
          };
     };

     const data = getChartData();

     return (
          <div className="chart-container">
               <h3>Spending by Category</h3>
               {Object.keys(categoryData || {}).length > 0 ? (
                    <Doughnut
                         data={data}
                         options={{
                              plugins: {
                                   tooltip: {
                                        callbacks: {
                                             label: (context) => {
                                                  const value = context.raw;
                                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                  const percentage = Math.round((value / total) * 100);
                                                  return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                                             }
                                        }
                                   }
                              }
                         }}
                    />
               ) : (
                    <div className="no-data-message">
                         No category data available
                    </div>
               )}
          </div>
     );
};

export default ExpenseChart;