const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Academic','Personal', 'Politics', 'Entertainment', 'Business', 'Technical', 'Other'],
    default: 'Personal',
    required: [true, 'Please provide a category name'],   
    unique: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
