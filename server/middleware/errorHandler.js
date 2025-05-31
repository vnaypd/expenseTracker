module.exports = (err, req, res, next) => {
     // Log the error with timestamp
     const errorLog = {
          timestamp: new Date().toISOString(),
          method: req.method,
          path: req.path,
          params: req.params,
          query: req.query,
          body: req.body,
          error: {
               name: err.name,
               message: err.message,
               stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
          },
          user: req.user?._id || 'unauthenticated'
     };

     console.error('API Error:', errorLog);

     // Determine status code
     const statusCode = err.statusCode || 500;

     // Prepare error response
     const response = {
          success: false,
          message: err.message || 'Internal Server Error',
          ...(process.env.NODE_ENV === 'development' && {
               error: err.message,
               stack: err.stack
          })
     };

     // Special handling for Mongoose errors
     if (err.name === 'CastError') {
          response.message = 'Invalid data format';
          response.field = err.path;
     }

     if (err.name === 'ValidationError') {
          response.message = 'Validation failed';
          response.errors = Object.values(err.errors).map(e => ({
               field: e.path,
               message: e.message
          }));
     }

     res.status(statusCode).json(response);
};