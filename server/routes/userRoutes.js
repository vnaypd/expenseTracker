const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
     try {
          const { email, password } = req.body;

          // Validate input
          if (!email || !password) {
               return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
               });
          }

          // Check if user exists
          const existingUser = await User.findOne({ email: email.toLowerCase() });
          if (existingUser) {
               return res.status(400).json({
                    success: false,
                    message: 'User already exists'
               });
          }

          // Create user
          const user = new User({
               email: email.toLowerCase(),
               password
          });

          // Hash password (handled in User model pre-save hook)
          await user.save();

          // Create token
          const token = jwt.sign(
               { id: user._id, email: user.email },
               process.env.JWT_SECRET,
               { expiresIn: '2h' }
          );

          // Set HTTP-only cookie
          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               maxAge: 2 * 60 * 60 * 1000 // 2 hours
          });

          res.status(201).json({
               success: true,
               token,
               user: {
                    id: user._id,
                    email: user.email
               }
          });

     } catch (err) {
          console.error('Registration error:', err);
          res.status(500).json({
               success: false,
               message: 'Registration failed'
          });
     }
});

// Login
router.post('/login', async (req, res) => {
     try {
          const { email, password } = req.body;

          // Validate input
          if (!email || !password) {
               return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
               });
          }

          // Find user
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
               });
          }

          // Check password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
               });
          }

          // Create token
          const token = jwt.sign(
               { id: user._id, email: user.email },
               process.env.JWT_SECRET,
               { expiresIn: '2h' }
          );

          // Set HTTP-only cookie
          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               maxAge: 2 * 60 * 60 * 1000 // 2 hours
          });

          res.json({
               success: true,
               token,
               user: {
                    id: user._id,
                    email: user.email
               }
          });

     } catch (err) {
          console.error('Login error:', err);
          res.status(500).json({
               success: false,
               message: 'Login failed'
          });
     }
});

// Verify token
router.get('/verify', async (req, res) => {
     try {
          const token = req.header('x-auth-token') || req.cookies.token;

          if (!token) {
               return res.status(401).json({
                    success: false,
                    message: 'No token provided'
               });
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.id).select('-password');

          if (!user) {
               return res.status(404).json({
                    success: false,
                    message: 'User not found'
               });
          }

          res.json({
               success: true,
               user
          });

     } catch (err) {
          console.error('Token verification error:', err);
          res.status(401).json({
               success: false,
               message: 'Invalid or expired token'
          });
     }
});

// Logout
router.get('/logout', (req, res) => {
     res.clearCookie('token');
     res.json({
          success: true,
          message: 'Logged out successfully'
     });
});

module.exports = router;