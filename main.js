const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bookRoutes = require("./routes/book.js");
const authRoutes = require("./routes/auth.js");
const summaryRoutes = require("./routes/textSummary.js");

require("dotenv").config();
const port = process.env.PORT || 3004;

//Middleware to parse the body object
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URI}/bookstore`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;


db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for MongoDB connection error
db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

// routes
app.get("/", (req, res) => {
  res.send("welcome to Book management system");
});

app.use("/books", bookRoutes);
app.use("/auth", authRoutes);
app.use("/extraction", summaryRoutes);

// Error handling middleware - global catches
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
