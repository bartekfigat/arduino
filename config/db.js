require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const db = process.env.DB_PASSWOR;
const db_heroku = process.env.DB_PASSWOR_HEOKU;
module.exports = {
  dbConnection: (io) => {
    mongoose
      .connect(process.env.DB_PASSWOR, {
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
