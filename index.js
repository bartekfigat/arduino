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
const { Board, LCD, Relays } = require("johnny-five");

const saltRounds = 10;
const myPlaintextPassword = `${process.env.Password}`;

(async function watcher() {
  try {
    const home = await Home.find({ _id: "5eb5cdbb0ea7d8211d97e76e" });

    console.log(home[0].lighting);
  } catch (e) {
    console.log(e);
  }
})();

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
  port: "COM9",
});

board.on("ready", () => {
  console.log("redy");
  const relay = new Relays([
    { pin: 13, type: "NC", id: "kuchnia" },
    { pin: 9, type: "NC", id: "pokoj" },
    { pin: 8, type: "NC", id: "garaz" },
  ]);

  let isOne = false;

  let matchOne;

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/led", async (req, res) => {
    const { led, id } = req.query;

    try {
      const agg = await Home.find(
        { lighting: { $elemMatch: { switch: id } } },
        { "lighting.$": 1 }
      );

      const match = agg[0].lighting[0].switch;
      matchOne = match;

      if (match === id) {
        await Home.updateOne(
          {
            _id: "5eb5cdbb0ea7d8211d97e76e",
            lighting: { $elemMatch: { switch: id } },
          },
          { $set: { "lighting.$.state": led } }
        );
      } else {
        console.log("not ok");
      }
    } catch (e) {
      console.log(e);
    }

    let numer;

    const changeStream = Home.watch({
      documentKey: { _id: "5eb5cdbb0ea7d8211d97e76e" },
    });
    changeStream.on("change", (result) => {
      isOne = led === "true";

      switch (id) {
        case "kuchnia":
          numer = 0;
          break;
        case "pokoj":
          numer = 1;
          break;
        case "garaz":
          numer = 2;
          break;
      }
      console.log("==================================================");
      console.log(
        `relay ID:${relay[numer].id}  relay PIN:${relay[numer].pin}  numer:${numer}`
      );
      console.log("==================================================");

      if (isOne) {
        relay[numer].close();
      } else {
        relay[numer].open();
      }
    });

    res.redirect("/");
  });

  const Port = process.env.PORT || 8080;

  server.listen(Port, () => {
    console.log(`Server is listening on port: ${Port}`);
  });
});
