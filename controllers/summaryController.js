const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");
const jwt_key = process.env.JWT_SECRET;

const summaryController = {
  getSummary: async (req, res) => {
    const { prompt } = req.body;

    try {
      const response = await axios.post("http://127.0.0.1:11434/api/generate", {
        model:"phi3",
        prompt,
        stream:false
      });

      res.json(response.data);
    } catch (error) {
      console.error("Error making API call:", error);
      res.status(500).send("Error making API call");
    }
  },
};

module.exports = summaryController;
