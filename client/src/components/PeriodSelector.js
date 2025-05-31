import React from 'react';

const PeriodSelector = ({ period, setPeriod }) => {
     return (
          <div className="period-selector">
               <button
                    className={period === 'day' ? 'active' : ''}
                    onClick={() => setPeriod('day')}
               >
                    Today
               </button>
               <button
                    className={period === 'week' ? 'active' : ''}
                    onClick={() => setPeriod('week')}
               >
                    This Week
               </button>
               <button
                    className={period === 'month' ? 'active' : ''}
                    onClick={() => setPeriod('month')}
               >
                    This Month
               </button>
          </div>
     );
};

export default PeriodSelector;