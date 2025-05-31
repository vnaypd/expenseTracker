const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
          lowercase: true
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

// Ensure unique category names per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);