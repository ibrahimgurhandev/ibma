const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const { setUpRoutes } = require("./app/routes.js");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const session = require("express-session");
const configDB = require("./config/database.js");
const RoomService = require("./app/services/roomService");
const UserService = require("./app/services/userServices");

let db;
//test
// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  setUpRoutes(app, passport, db);
});
mongoose.set("useFindAndModify", false);

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(express.json()); // get information from html forms
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rcbootcamp2019a", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================

const botName = "Bonodero the Welcome Bot";

const formatMessage = require("./app/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./app/utils/users");
const UserSchema = require("./app/models/UserSchema.js");

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ username, room }) => {
    // Deleted usernamne and replaced line 74 user.name with username
    await UserService.updateRoomAndSocket(
      username,
      room,
      socket.id
    ).catch((err) => console.log("Error Joining user to socket", err));
    socket.join(room);
    socket.emit("message", formatMessage(botName, `Welcome to ${room} room!`));
    socket
      .to(room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );
    io.to(room).emit("roomUsers", {
      room: room,
      users: await UserService.getByRoom(room).catch((err) =>
        console.log("Error in room user broadcast: ", err)
      ),
    });
  });

  socket.on("chatMessage", async (msg, username) => {
    const user = await UserService.getByName(username);
    RoomService.addMessage(user.room, { userId: user._id, text: msg });
    io.to(user.room).emit("message", formatMessage(user.name, msg));
  });

  socket.on("disconnect", async () => {
    const user = await UserService.clearRoomAndSocket(socket.id).catch((err) =>
      console.log(" error in disconnect", err)
    );
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.name} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await UserService.getByRoom(user.room).catch((err) =>
          console.log("Error in roomusers Evcent on disconnect", err)
        ),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
