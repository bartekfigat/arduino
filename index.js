const SerialPort = require("serialport").SerialPort;
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { Board, Led, Button, Switch, Relays, LCD } = require("johnny-five");

const board = new Board({
  port: "COM11",
});

server = express();

server.use(morgan("tiny"));
// view engine setup
// view engine setup
server.set("views", path.join(__dirname, "views"));
server.set("view engine", "ejs");
// Staic file
server.use(express.static("public"));
server.use(express.static(path.join(__dirname, "public")));

board.on("ready", () => {
  console.log("redy");
  const relay = new Relays([13, 11, 10, 9, 8, 7, 6, 5], {
    type: "NC",
  });
  server.get("/", (req, res) => {
    let isOne = true;

    if (!isOne) {
      relay.off();
    } else {
      relay.on();
    }
    res.render("index", { r: isOne });
  });

  server.listen(3000, () => {
    console.log("Server running");
  });
});
