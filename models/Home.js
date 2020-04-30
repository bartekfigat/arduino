const mongoose = require("mongoose");

// Create Schema

const Home = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  light: { type: Boolean, default: false },
});

module.exports = mongoose.model("Home", Home);
