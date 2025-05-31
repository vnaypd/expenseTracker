const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Expense = require('../models/Expense');

// Get all categories with expense counts
router.get('/', async (req, res) => {
     try {
          const categories = await Category.find({ user: req.user.id });

          // Get expense counts for each category
          const categoriesWithCounts = await Promise.all(
               categories.map(async (category) => {
                    const count = await Expense.countDocuments({
                         user: req.user.id,
                         $or: [
                              { categoryRef: category._id },
                              { category: category.name }
                         ]
                    });
                    return {
                         ...category._doc,
                         expenseCount: count
                    };
               })
          );

          res.json({
               success: true,
               categories: categoriesWithCounts
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: 'Failed to fetch categories',
               error: err.message
          });
     }
});

// Create new category
router.post('/', async (req, res) => {
     try {
          const { name } = req.body;

          if (!name || name.trim() === '') {
               return res.status(400).json({
                    success: false,
                    message: 'Category name is required'
               });
          }

          // Check if category already exists
          const existingCategory = await Category.findOne({
               name: name.trim().toLowerCase(),
               user: req.user.id
          });

          if (existingCategory) {
               return res.status(400).json({
                    success: false,
                    message: 'Category already exists'
               });
          }

          const category = new Category({
               name: name.trim().toLowerCase(),
               user: req.user.id
          });

          await category.save();

          res.status(201).json({
               success: true,
               category
          });
     } catch (err) {
          res.status(400).json({
               success: false,
               message: 'Failed to create category',
               error: err.message
          });
     }
});

// Delete category and update related expenses
router.delete('/:id', async (req, res) => {
     try {
          // Find and delete category
          const category = await Category.findOneAndDelete({
               _id: req.params.id,
               user: req.user.id
          });

          if (!category) {
               return res.status(404).json({
                    success: false,
                    message: 'Category not found'
               });
          }

          // Update expenses that reference this category
          await Expense.updateMany(
               {
                    user: req.user.id,
                    $or: [
                         { categoryRef: req.params.id },
                         { category: category.name }
                    ]
               },
               {
                    $set: {
                         category: category.name,
                         categoryRef: null
                    }
               }
          );

          res.json({
               success: true,
               message: 'Category deleted successfully'
          });
     } catch (err) {
          res.status(500).json({
               success: false,
               message: 'Failed to delete category',
               error: err.message
          });
     }
});

module.exports = router;