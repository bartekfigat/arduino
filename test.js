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
const { Board, LCD, Relays, Relay } = require("johnny-five");

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

const board = new Board({
  port: "COM11",
});

board.on("ready", () => {
  console.log("redy");
  const kuchnia = new Relay({
    pin: 13,
    id: "kuchnia",
    type: "NC",
  });
  const pokoj = new Relay({
    pin: 12,
    id: "pokoj",
    type: "NC",
  });
  const garaz = new Relay({
    pin: 11,
    id: "garaz",
    type: "NC",
  });

  const allRelays = [kuchnia, pokoj, garaz];

  let isOne = false;

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/led", async (req, res) => {
    const { led, id } = req.query;
    console.log(id);

    const updateLed = await Home.updateOne(
      { _id: "5eab53d3a524043460a84354" },
      { light: led }
    );

    const changeStream = Home.watch({ fullDocument: "updateLookup" });
    changeStream.on("change", (result) => {
      console.log(result);
      isOne = led === "true";

      allRelays.map((relays, index) => {
        if (relays.id === id) {
          if (isOne) {
            relays.off();
          } else {
            relays.on();
          }
        }
      });
    });

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
});
