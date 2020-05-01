const mongoose = require("mongoose");

// Create Schema

const Home = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  light: { type: String, default: "false" },
  created: { type: Date },
});

module.exports = mongoose.model("Home", Home);
