require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const PubNub = require("pubnub");
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
  let num;

  pubnub.addListener({
    status: (statusEvent) => {
      console.log(`Status: ${statusEvent}`);
    },
    message: async (msg) => {
      const { clientLed, clientID } = msg.message;

      await updatechangeStream(num, isOne, relay, clientLed, clientID);
      console.log(`clientLed: ${clientLed}`);
      console.log(`clientID: ${clientID}`);
    },
  });
  console.log("Subscribing..");
  pubnub.subscribe({
    channels: ["smart-switch"],
  });

  const Port = process.env.PORT || 8080;

  server.listen(Port, () => {
    console.log(`Server is listening on port: ${Port}`);
  });
});
