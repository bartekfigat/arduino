const mongoose = require("mongoose");

// Create Schema

const Home = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  created: { type: Date },
  lighting: [
    {
      switch: { type: String },
      state: { type: String, default: "false" },
    },
  ],
});

module.exports = mongoose.model("Home", Home);
