require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const ngrok = require("ngrok");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const favicon = require("express-favicon");
const Home = require("./models/Home");
const path = require("path");
const { Board, LCD, Relay } = require("johnny-five");

const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;

//function that searches all database
(async function all() {
  let home = await Home.find({});
  console.log(home);
})();

//============with promises================
// Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash).then(function(result) {
// result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash).then(function(result) {
// result == false
// });

// (async function () {
//   const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);

//   try {
//     Home.insertMany({
//       email: `${process.env.email}`,
//       password: hash,
//       light: false,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// })();

server = express();
server.use(morgan("tiny"));
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
// Staic file
server.use(express.static("public"));
server.use(express.static(path.join(__dirname, "public")));
server.use(favicon(__dirname + "/public/favicon.png"));
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//DB connect
db.dbConnection();

server.get("/", (req, res) => {
  res.render("index");
});

server.get("/led", (req, res) => {
  const { led } = req.query;
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
