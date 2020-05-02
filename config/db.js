require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const Home = require("../models/Home");

module.exports = {
  dbConnection: (io) => {
    const db = process.env.DB_PASSWOR;
    const db_heroku = process.env.DB_PASSWOR_HEOKU;
    mongoose
      .connect(`${db}`, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("mongoDB connected");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  },
};
