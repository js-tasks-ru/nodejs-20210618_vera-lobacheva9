const mongoose = require('mongoose');
const connection = require('../libs/connection');


const subCategorySchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  subcategories: [subCategorySchema],
  title: { 
    type: String,
    required: true,
  },
});

module.exports = connection.model('Category', categorySchema);
