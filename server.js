const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

require("./sockets/userSockets.js")(io);
require("./config/passport")(passport);

const { setUpRoutes } = require("./app/routes.js");
var db;
console.log(process.env);
mongoose.connect(process.env.DATABASE_URL, (err, database) => {
  db = database;
  if (err) return console.log(err);
  setUpRoutes(app, passport, db);
});
mongoose.set("useFindAndModify", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({ secret: "rcbootcamp2019a", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set("view engine", "ejs");

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
