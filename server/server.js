const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const User = require("./models/User");


// middleware
app.use(cors());

// app.use(express.json());
app.use(express.json({
  limit: "50mb",
}));

app.use(express.urlencoded({
  limit: "50mb",
  extended: true,
}));


// routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/messages", require("./routes/messageRoutes"));

app.use( "/uploads",express.static("uploads")
);


// socket
// io.on("connection", (socket) => {

//   console.log("User Connected");

//   socket.on("sendMessage", (message) => {

//     socket.broadcast.emit(
//       "receiveMessage",
//       message
//     );
//   });

//   socket.on("disconnect", () => {

//     console.log("User Disconnected");
//   });
// });

const onlineUsers = new Map();

io.on("connection", (socket) => {

  console.log("User Connected");

  socket.on("userOnline", async (userId) => {

    socket.userId = userId;

    onlineUsers.set(userId, socket.id);

    await User.findByIdAndUpdate(
      userId,
      {
        isOnline: true,
      }
    );

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.keys())
    );
  });

  socket.on("sendMessage", (message) => {

    socket.broadcast.emit(
      "receiveMessage",
      message
    );
  });

  socket.on("disconnect", async () => {

    console.log("User Disconnected");

    if (socket.userId) {

      onlineUsers.delete(socket.userId);

      await User.findByIdAndUpdate(
        socket.userId,
        {
          isOnline: false,
          lastSeen: new Date(),
        }
      );

      io.emit(
        "onlineUsers",
        Array.from(onlineUsers.keys())
      );
    }
  });
});


// mongodb
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

  server.listen(5000, () => {

    console.log("Server running on port 5000");
  });
})
.catch((err) => console.log(err));
