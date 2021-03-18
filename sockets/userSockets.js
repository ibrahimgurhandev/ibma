const UserService = require("../app/services/userServices");
const RoomService = require("../app/services/roomServices");
const botName = "Bonodero the Welcome Bot";

const formatMessage = require("../app/utils/messages");

module.exports = function(io){

    io.on("connection", (socket) => {
        socket.on("joinRoom", async ({ username, room }) => {
          // Deleted usernamne and replaced line 74 user.name with username
          await UserService.updateRoomAndSocket(
            username,
            room,
            socket.id
          ).catch((err) => console.log("Error Joining user to socket", err));
          socket.join(room);
          socket.emit(
            "message",
            formatMessage(botName, `Welcome to the ${room} speaking room!`)
          );
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
      
}