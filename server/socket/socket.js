let onlineUsers = {};

const setupSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);


    // user joins
    socket.on("join", (userId) => {

      onlineUsers[userId] = socket.id;

      console.log("Online Users:", onlineUsers);

      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });


    // disconnect
    socket.on("disconnect", () => {

      console.log("User Disconnected:", socket.id);

      for (let userId in onlineUsers) {

        if (onlineUsers[userId] === socket.id) {

          delete onlineUsers[userId];

          break;
        }
      }

      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });

  });

};

module.exports = setupSocket;