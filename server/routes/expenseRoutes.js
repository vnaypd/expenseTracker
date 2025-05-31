const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Category = require('../models/Category');

// Add this route to your existing expenseRoutes.js
router.get('/summary', async (req, res) => {
     try {
          // 1. Get current date ranges
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekStart = new Date(todayStart);
          weekStart.setDate(todayStart.getDate() - todayStart.getDay()); // Start of week (Sunday)
          const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

          // 2. Fetch all expenses once
          const expenses = await Expense.find({ user: req.user.id })
               .populate('categoryRef', 'name')
               .lean();

          // 3. Helper function to filter and sum expenses
          const getPeriodTotal = (startDate) => {
               return expenses
                    .filter(e => new Date(e.date) >= startDate)
                    .reduce((sum, e) => sum + (e.amount || 0), 0);
          };

          // 4. Calculate totals for each period
          const totals = {
               daily: getPeriodTotal(todayStart),
               weekly: getPeriodTotal(weekStart),
               monthly: getPeriodTotal(monthStart),
               allTime: expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
          };

          // 5. Group by category with proper null checks
          const byCategory = expenses.reduce((acc, expense) => {
               const categoryName = expense.categoryRef?.name || expense.category || 'Uncategorized';
               acc[categoryName] = (acc[categoryName] || 0) + (expense.amount || 0);
               return acc;
          }, {});

          // 6. Get recent expenses (sorted by date, newest first)
          const recentExpenses = [...expenses]
               .sort((a, b) => new Date(b.date) - new Date(a.date))
               .slice(0, 5)
               .map(e => ({
                    _id: e._id,
                    description: e.description || 'No description',
                    amount: e.amount || 0,
                    date: e.date,
                    category: e.categoryRef?.name || e.category || 'Uncategorized'
               }));

          // 7. Send response
          res.json({
               success: true,
               data: {
                    totals,
                    byCategory,
                    recentExpenses
               }
          });

     } catch (err) {
          console.error('Summary API Error:', {
               message: err.message,
               stack: err.stack,
               timestamp: new Date()
          });

          res.status(500).json({
               success: false,
               message: 'Failed to generate summary',
               error: process.env.NODE_ENV === 'development' ? {
                    message: err.message,
                    stack: err.stack
               } : 'Internal server error'
          });
     }
});;

// Get all expenses with category details
router.get('/', async (req, res) => {
     try {
          const expenses = await Expense.find({ user: req.user.id })
               .populate('categoryRef', 'name')
               .sort({ date: -1 });

          const formattedExpenses = expenses.map(expense => ({
               ...expense._doc,
               category: expense.categoryRef?.name || expense.category
          }));

          res.json({
               success: true,
               expenses: formattedExpenses
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: 'Failed to fetch expenses',
               error: err.message
          });
     }
});

// Get single expense with category details
router.get('/:id', async (req, res) => {
     try {
          const expense = await Expense.findOne({
               _id: req.params.id,
               user: req.user.id
          }).populate('categoryRef', 'name');

          if (!expense) {
               return res.status(404).json({
                    success: false,
                    message: 'Expense not found'
               });
          }

          res.json({
               success: true,
               expense: {
                    ...expense._doc,
                    category: expense.categoryRef?.name || expense.category
               }
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: 'Failed to fetch expense',
               error: err.message
          });
     }
});

// Create new expense
router.post('/', async (req, res) => {
     try {
          const { description, amount, category, date } = req.body;

          // Find or create category
          let categoryRef = null;
          const existingCategory = await Category.findOne({
               name: category,
               user: req.user.id
          });

          if (existingCategory) {
               categoryRef = existingCategory._id;
          }

          const expense = new Expense({
               description,
               amount,
               category,
               categoryRef,
               date: date || Date.now(),
               user: req.user.id
          });

          await expense.save();

          res.status(201).json({
               success: true,
               expense: {
                    ...expense._doc,
                    category: expense.category
               }
          });
     } catch (err) {
          res.status(400).json({
               success: false,
               message: 'Failed to create expense',
               error: err.message
          });
     }
});

// Update expense
router.put('/:id', async (req, res) => {
     try {
          const { description, amount, category, date } = req.body;

          // Find or create category
          let categoryRef = null;
          const existingCategory = await Category.findOne({
               name: category,
               user: req.user.id
          });

          if (existingCategory) {
               categoryRef = existingCategory._id;
          }

          const expense = await Expense.findOneAndUpdate(
               { _id: req.params.id, user: req.user.id },
               { description, amount, category, categoryRef, date },
               { new: true }
          ).populate('categoryRef', 'name');

          if (!expense) {
               return res.status(404).json({
                    success: false,
                    message: 'Expense not found'
               });
          }

          res.json({
               success: true,
               expense: {
                    ...expense._doc,
                    category: expense.categoryRef?.name || expense.category
               }
          });
     } catch (err) {
          res.status(400).json({
               success: false,
               message: 'Failed to update expense',
               error: err.message
          });
     }
});

// Delete expense
router.delete('/:id', async (req, res) => {
     try {
          const expense = await Expense.findOneAndDelete({
               _id: req.params.id,
               user: req.user.id
          });

          if (!expense) {
               return res.status(404).json({
                    success: false,
                    message: 'Expense not found'
               });
          }

          res.json({
               success: true,
               message: 'Expense deleted successfully'
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: 'Failed to delete expense',
               error: err.message
          });
     }
});


module.exports = router;