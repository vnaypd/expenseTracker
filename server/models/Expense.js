const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
     description: {
          type: String,
          required: true,
          trim: true
     },
     amount: {
          type: Number,
          required: true,
          min: 0
     },
     category: {
          type: String,
          required: true
     },
     categoryRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category'
     },
     date: {
          type: Date,
          default: Date.now
     },
     user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     }
}, {
     timestamps: true,
     toJSON: {
          virtuals: true,
          transform: function (doc, ret) {
               delete ret.__v;
               delete ret.createdAt;
               delete ret.updatedAt;
          }
     }
});

module.exports = mongoose.model('Expense', expenseSchema);