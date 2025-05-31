const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
     // Get token from header, cookie, or query param
     let token = req.header('x-auth-token') ||
          req.cookies.token ||
          req.query.token;

     if (!token) {
          return res.status(401).json({
               success: false,
               message: 'Authorization token missing',
               solution: 'Please login to get a new token'
          });
     }

     try {
          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Check expiration
          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
               return res.status(401).json({
                    success: false,
                    message: 'Token expired',
                    solution: 'Please login again'
               });
          }

          // Attach user to request
          req.user = decoded;
          next();
     } catch (err) {
          console.error('JWT Error:', err.message);

          let message = 'Invalid token';
          if (err.name === 'TokenExpiredError') {
               message = 'Token expired';
          } else if (err.name === 'JsonWebTokenError') {
               message = 'Malformed token';
          }

          res.status(401).json({
               success: false,
               message,
               solution: 'Please login again to get a new token'
          });
     }
};