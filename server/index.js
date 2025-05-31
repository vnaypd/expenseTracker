require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: err.message
     });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));