require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const fetch = require("node-fetch");
const favicon = require("express-favicon");
const Home = require("./models/Home");
const { Board, LCD, Relay } = require("johnny-five");

const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;
//DB connect

const app = express();
const server = http.createServer(app);
const io = socketio(server);

db.dbConnection(io);

app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// // Staic file

app.use(express.static(path.join(__dirname, "./public")));
app.use(favicon(__dirname + "/public/favicon.png"));
app.use(
  cors({
    credentials: true,
    origin: "https://guarded-meadow-49625.herokuapp.com/",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let isOne = false;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/led", async (req, res) => {
  const { led } = req.query;

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
