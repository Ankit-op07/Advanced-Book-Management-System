const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const multer = require('multer');
const Book = require('./models/book.js')

// to parse the body object
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Check MongoDB connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for MongoDB connection error
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});


// it is a kind of a middleware function
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Files will be stored in the uploads directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Keep the original file name
    }
  })
  const upload = multer({ storage: storage });


app.get('/',(req,res)=>{
    res.send('welcome to Book management system')
})

app.post('/add-book',upload.single('bookFile'),async(req,res)=>{
    console.log('request came')
    const { authorName, bookName,bookPrice,bookPages } = req.body;
    const filePath = req.file.path;
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
        res.json({ message: 'Book uploaded successfully.' });
      } catch (err) {
        console.error('Error uploading book:', err);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
)
app.get('/books',async(req,res)=>{
    const books = await Book.find();
    res.send(books)
})

app.put('/update-book/:id',upload.single('bookFile'),async(req,res)=>{
    const {id} = req.params;
    const {authorName,bookName,bookPrice,bookPages} = req.body;
    const filePath = req.file.path;

    console.log(id,filePath,authorName,bookName,bookPrice,bookPages)

    try{
        const updatedBook = await Book.findByIdAndUpdate(id,{
            authorName,
            bookName,
            bookPrice,
            bookPages,
            filePath
        })
        res.send(updatedBook);
    }catch(err){
        res.send(err);
    }
})

app.delete('/delete-book/:id',async(req,res)=>{
  const {id} = req.params;
  try{
    const deletedBook = await Book.findByIdAndDelete(id);
    res.send(deletedBook);  
  }catch{
    res.send(err);
  }
})
    


app.listen(port,()=>{
    console.log('server is running on port ' + port)
})