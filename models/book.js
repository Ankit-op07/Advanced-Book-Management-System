const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    authorName: String,
    bookName: String,
    bookPrice:Number,
    bookPages:Number,
    filePath: String,
  });
  
  // Create a model based on the schema
  const Book = mongoose.model('Book', bookSchema);
  module.exports = Book