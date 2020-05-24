require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const PubNub = require("pubnub");
const socketio = require("socket.io");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const fetch = require("node-fetch");
const favicon = require("express-favicon");
const Home = require("./models/Home");
const { updateState } = require("./controller/updateState");
const { updatechangeStream } = require("./controller/changeStream");
const { Board, LCD, Relays, Relay } = require("johnny-five");

const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;
const pubnub = new PubNub({
  subscribe_key: process.env.SUBSCRIBE_KEY,
  publish_key: process.env.PUBLISH_KEY,
});

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
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const board = new Board({
  port: "COM11",
});

board.on("ready", () => {
  console.log("redy");
  const r1 = new Relay({
    pin: 13,
    type: "NC",
  });
  const r2 = new Relay({
    pin: 7,
    type: "NC",
  });
  const r3 = new Relay({
    pin: 11,
    type: "NC",
  });

  const relay = new Relays([r1, r2, r3]);

  let isOne = false;

  app.get("/", async (req, res) => {
    const home = await Home.find({ _id: "5eb5cdbb0ea7d8211d97e76e" });
    res.render("index", { home });
  });

  io.on("connection", (socket) => {
    socket.on("dataFromClient", (element, id) => {
      console.log(`element:  ${element}`);
      console.log(`id     :  ${id}`);
    });
    app.get("/led", async (req, res) => {
      const { led, id } = req.query;

      await updateState(led, id);

      let num;

      await updatechangeStream(num, isOne, relay, led, id);

      res.redirect("/");
    });
  });

  const Port = process.env.PORT || 8080;

  server.listen(Port, () => {
    console.log(`Server is listening on port: ${Port}`);
  });
});
