require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const PubNub = require("pubnub");
const db = require("./config/db");
const favicon = require("express-favicon");
const Home = require("./models/Home");
const { updateState } = require("./controller/updateState");

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

app.get("/", async (req, res) => {
  const home = await Home.find({ _id: "5eb5cdbb0ea7d8211d97e76e" });
  res.render("index", { home });
});

app.get("/led", async (req, res) => {
  const { led, id } = req.query;

  pubnub.publish({
    channel: "smart-switch",
    message: {
      clientLed: led,
      clientID: id,
    },
  });

  await updateState(led, id);

  res.send("/");
});

const Port = process.env.PORT || 8080;

server.listen(Port, () => {
  console.log(`Server is listening on port: ${Port}`);
});
