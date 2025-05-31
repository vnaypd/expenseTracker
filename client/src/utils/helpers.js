export const formatCurrency = (amount) => {
     return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
     }).format(amount || 0);
};

export const formatDate = (dateString) => {
     const options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
     };
     return new Date(dateString).toLocaleDateString('en-IN', options);
};

export const groupBy = (array, key) => {
     return array.reduce((result, item) => {
          const groupKey = typeof key === 'function' ? key(item) : item[key];
          (result[groupKey] = result[groupKey] || []).push(item);
          return result;
     }, {});
};