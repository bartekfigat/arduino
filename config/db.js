require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

module.exports = {
  dbConnection: () => {
    const db = process.env.DB_PASSWOR;
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
