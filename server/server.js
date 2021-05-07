// Create HTTP Server (for API URL Endpoints)
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// Use dotenv to avoid exposing URIs
require("dotenv").config();

// Enable CORS for user routes
const cors = require("cors");
app.use(cors());

// Use user route middleware
const user = require("./routes/user");

// Use parser middleware for parsing body data
app.use(express.json()); // parse app/json
app.use(express.urlencoded({ extended: true })); // parse app/x-www-form-urlencoded

// Initiate Mongo Server
const InitiateMongoServer = require("./config/db");
InitiateMongoServer();

// Set port that the server will listen on
const PORT = process.env.PORT || 5000;

// Integrate Socket.IO and enable Cross-Origin Resource Sharing (CORS)
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.REQUESTS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Simple route handler to test if server
// is running on localhost:PORT
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router middleware
 * Router - /user/*
 * Method - *
 */
app.use("/user", user);

// Listen on the 'connection' event for incoming sockets
io.on("connection", (socket) => {
  // Retrieve ID of connected user from socket
  const id = socket.handshake.query.id;

  // Subscribe socket of connected user to its own room channel
  // (which is simply their user ID) and log connected user
  socket.join(id);
  console.log(`Connected UID: ${id}`);

  // Broadcast sent message to all sockets (I THINK)
  socket.on("send-message", ({ id, recipients }) => {
    recipients.forEach((recipient) => {
      io.to(recipient).emit("receive-message", id);
    });
  });

  // On disconnect, sockets leave all channels automatically
  socket.on("disconnect", () => {
    console.log(`Disconnected UID: ${id}`);
  });
});

// Set server to listen on localhost:PORT
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
