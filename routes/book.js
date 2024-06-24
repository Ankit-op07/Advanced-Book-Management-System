const express = require('express');
const bookController = require('../controllers/book');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Files will be stored in the uploads directory
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Keep the original file name
    }
  })
const upload = multer({ storage: storage });

router.use(authMiddleware)

router.get('/get-all-books', bookController.getAllBooks);
router.post('/add-book',upload.single('bookFile'), bookController.addBook);
router.put('/update-book/:id',upload.single('bookFile'), bookController.updateBook);
router.delete('/delete-book/:id', bookController.deleteBook);
router.get('/download-book/:id', bookController.downloadBook);
router.get('/get-text-info/:id', bookController.getTextInfo);


module.exports = router

