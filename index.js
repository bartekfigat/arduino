require("dotenv").config();
const SerialPort = require("serialport").SerialPort;
const device = require("express-device");
const express = require("express");
const morgan = require("morgan");
const ngrok = require("ngrok");
const cors = require("cors");
const etag = require("etag");
const net = require("net");
const bodyParser = require("body-parser");
const favicon = require("express-favicon");
const path = require("path");
const {
  Board,
  Led,
  Button,
  Switch,
  Relays,
  Thermometer,
  LCD,
  Relay,
} = require("johnny-five");

const board = new Board({
  port: "COM11",
});

server = express();
server.use(morgan("tiny"));
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
// Staic file
server.use(express.static("public"));
server.use(express.static(path.join(__dirname, "public")));
server.use(favicon(__dirname + "/public/favicon.png"));
server.use(express.static(__dirname + "/public/main.css"));
server.use(express.static(__dirname + "/public/main.js"));
server.use(device.capture());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.disable("etag");

board.on("ready", async () => {
  console.log("redy");
  const relay = await new Relay({
    type: "NC",
    pin: 13,
    id: "kuchnia",
  });

  newFunction(relay);
});
function newFunction(relay) {
  let isOne = false;
  server.get("/", (req, res) => {
    res.render("index");
  });
  server.get("/led", (req, res) => {
    const { led } = req.query;
    isOne = led === "true";
    console.log(isOne);
    if (!isOne) {
      relay.off();
    } else {
      relay.on();
    }

    res.json({ l: isOne });
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`);
    (async function () {
      const opts = {
        addr: process.env.PORT, // port or network address, defaults to 80
        auth: "user:pwd",
        authtoken: `${process.env.Authtoken}`, // http basic authentication for tunnel
      };
      const url = await ngrok.connect(opts);

      try {
        const url = await ngrok.connect(opts);
        console.log(
          `Public accessible tunnel to localhost:${process.env.PORT} is availbale on ${url}`
        );
      } catch (err) {
        console.log(err);
      }
    })();
  });
}
