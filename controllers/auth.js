const authUser = require("../models/authUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_SECRET;

const authController = {
  signup: async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new authUser({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.send(savedUser);
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await authUser.findOne({ email }).exec();

    if (!user) {
      return res.status(400).send("User not found");
    } else {
      
      const validPassword = await bcrypt.compare(password, user.password);

     
    
      if (!validPassword) {
        return res.status(400).send("Invalid password");
      } else {
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            jwt_key, // Use a more secure key in production
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message:"login success",
            token:token
        });
      }
    }
  },
};

module.exports = authController;
