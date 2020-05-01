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
//https://docs.mongodb.com/stitch/mongodb/watch/
const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;

// const pipeline = [
//   { $match: { _id: "5eab53d3a524043460a84354" } },
//   { $set: { light: "got" } },
// ];
// async function watcher() {
//   const collection = Home.watch();

//   const changeStream = collection.watch(pipeline);

//   console.log(changeStream);
// let home = await Home.find({});
// // // await Home.deleteOne({});
// console.log(home);

// watcher();

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
//       created: new Date().getTime(),
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

server.get("/led", async (req, res) => {
  const { led } = req.query;
  console.log(led);

  pipeline = [{ $match: { _id: "5eab53d3a524043460a84354" } }];

  const changeStream = Home.watch(pipeline);

  changeStream.on("change", function (event) {
    console.log(JSON.stringify(event));
  });

  let repalce = await Home.updateOne(
    { _id: "5eab53d3a524043460a84354" },
    { light: led }
  );

  const match = await Home.findOne({ _id: "5eab53d3a524043460a84354" });
  console.log(match.light);
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});
