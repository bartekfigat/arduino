require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const ngrok = require("ngrok");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const fetch = require("node-fetch");
const favicon = require("express-favicon");
const Home = require("./models/Home");
const path = require("path");
const { Board, LCD, Relay } = require("johnny-five");

const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;

server = express();
server.use(morgan("tiny"));
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
// Staic file
server.use(express.static("public"));
server.use(express.static(path.join(__dirname, "public")));
server.use(favicon(__dirname + "/public/favicon.png"));
server.use(
  cors({
    credentials: true,
    origin: " https://guarded-meadow-49625.herokuapp.com/",
  })
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//DB connect
db.dbConnection();

let isOne = false;

server.get("/", (req, res) => {
  res.render("index");
});

server.get("/led", async (req, res) => {
  const { led } = req.query;

  const changeStream = Home.watch().on("change", (data) => {
    console.log(data);
  });

  const updateLed = await Home.updateOne(
    { _id: "5eab53d3a524043460a84354" },
    { light: led }
  );

  if (updateLed) {
    res.redirect("/");
  } else {
    return null;
  }
});

const Port = process.env.PORT || 8080;

server.listen(Port, () => {
  console.log(`Server is listening on port: ${Port}`);
});
