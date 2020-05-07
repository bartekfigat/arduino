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
//DB connect

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

(async function watcher() {
  const agg = await Home.find(
    { lighting: { $elemMatch: { switch: "pokoj" } } },
    { "lighting.$": 1 }
  );

  console.log(agg[0].lighting[0].switch);
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
  port: "COM11",
});

board.on("ready", () => {
  console.log("redy");
  const relay = new Relays([
    { pin: 13, type: "NC", id: "kuchnia" },
    { pin: 9, type: "NC", id: "pokoj" },
    { pin: 8, type: "NC", id: "garaz" },
  ]);

  let isOne = false;

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/led", async (req, res) => {
    const { led, id } = req.query;

    const agg = await Home.find(
      { lighting: { $elemMatch: { switch: id } } },
      { "lighting.$": 1 }
    );

    const match = agg[0].lighting[0].switch;

    if (match === id) {
      console.log("ok");
    } else {
      console.log("not ok");
    }

    let numer;

    const changeStream = Home.watch({ fullDocument: "updateLookup" });
    changeStream.on("change", (result) => {
      console.log(result);
      isOne = led === "false";

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

      if (isOne) {
        relay[numer].off();
      } else {
        relay[numer].on();
      }
    });

    res.redirect("/");
  });

  const Port = process.env.PORT || 8080;

  server.listen(Port, () => {
    console.log(`Server is listening on port: ${Port}`);
  });
});
