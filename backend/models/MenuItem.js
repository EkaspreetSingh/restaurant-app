const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Mains', 'Desserts', 'Beverages']
  },
  image: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: [] // e.g., ['hot', 'vegetarian', 'chef-special']
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
