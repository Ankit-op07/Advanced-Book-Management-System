const fs = require('fs')
const pdf = require('pdf-parse');
const Book = require('../models/book')
const path = require('path');
const zod = require('zod')
const BookSchema = require('../ValidationSchema/BookSchema')

const bookController = {
  addBook: async (req, res) => {
    console.log("request came");
    const { authorName, bookName, bookPrice, bookPages } = req.body;
    const filePath = req.file.path;

    const response = BookSchema.safeParse({
      authorName,
      bookName,
      bookPrice,
      bookPages,
      filePath,
    });

    if (!response.success) {
      res.status(402).json({
        success: false,
        message: response.error,
      });

      return;
    }

    try {
      // Create a new book document
      const newBook = new Book({
        authorName,
        bookName,
        bookPrice,
        bookPages,
        filePath,
      });
      // Save the book to the database
      await newBook.save();
      res.json({ message: "Book uploaded successfully." });
    } catch (err) {
      console.error("Error uploading book:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  },
  getAllBooks: async (req, res) => {
    const books = await Book.find({});
    console.log(books);
    res.send(books);
  },
  deleteBook: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBook = await Book.findByIdAndDelete(id);
      res.send(deletedBook);
    } catch {
      res.send(err);
    }
  },
  downloadBook: async (req, res) => {
    const { id } = req.params;
    try {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      const filePath = book.filePath;
      res.download(filePath, book.bookName + path.extname(filePath), (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    } catch (err) {
      console.error("Error finding book:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateBook: async (req, res) => {
    const { id } = req.params;
    const { authorName, bookName, bookPrice, bookPages } = req.body;
    const filePath = req.file.path;

    console.log(id, filePath, authorName, bookName, bookPrice, bookPages);

    try {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        {
          authorName,
          bookName,
          bookPrice,
          bookPages,
          filePath,
        },
        { new: true }
      );
      res.send(updatedBook);
    } catch (err) {
      res.send(err);
    }
  },
  getTextInfo: async(req,res)=>{
    const id = req.params.id;
    const book = await Book.find({_id:id},);
    const filePath = book[0].filePath;
  
    let dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const folderPath = path.join(__dirname, 'ExtractedTextFiles'); // Specify the folder path
  
    // Ensure the folder exists, create if not
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
    const outputPath = path.join(folderPath, book[0].bookName + '.txt');
    fs.writeFile(outputPath,data.text,(err)=>{
      if(err){
        console.log(err)
      }
    })
    res.json({
      bookName:book[0].bookName,
      textContent:data.text
    })
  }
};

module.exports = bookController;