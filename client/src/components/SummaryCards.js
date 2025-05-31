import React from 'react';
import { formatCurrency } from '../utils/helpers';

const SummaryCards = ({ totals }) => {
     return (
          <div className="summary-cards">
               <div className="summary-card total">
                    <h3>Total Spent</h3>
                    <p>{formatCurrency(totals.allTime)}</p>
               </div>
               <div className="summary-card daily">
                    <h3>Today</h3>
                    <p>{formatCurrency(totals.daily)}</p>
               </div>
               <div className="summary-card weekly">
                    <h3>This Week</h3>
                    <p>{formatCurrency(totals.weekly)}</p>
               </div>
               <div className="summary-card monthly">
                    <h3>This Month</h3>
                    <p>{formatCurrency(totals.monthly)}</p>
               </div>
          </div>
     );
};

export default SummaryCards;