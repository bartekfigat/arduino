const SerialPort = require("serialport").SerialPort;
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const {
  Board,
  Led,
  Button,
  Switch,
  Relays,
  Thermometer,
  LCD,
} = require("johnny-five");

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

  newFunction(relay);

  // const temperature = new Thermometer({
  //   pin: "A0",
  // });

  // temperature.on("data", function () {
  //   console.log(`celsius: ${this.C}`);
  // });
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
    if (isOne) {
      relay[0].off();
    } else {
      relay[0].on();
    }
    res.json({ l: isOne });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, process.env.IP, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
