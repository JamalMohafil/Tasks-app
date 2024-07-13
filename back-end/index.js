const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
dotenv.config();
const {
  notifyUser,
  notifyMessage,
  app,
  server,
} = require("./socket/socket");

// Middleware
const corsOption = {
  origin:"http://localhost:3000",
  credentials:true
}
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true })); // for URL-encoded data

// Require isAdmin middleware
const { isAdmin } = require("./middleware");

// Routes
const tasksRouter = require("./routes/tasks");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");
const notificationsRouter = require("./routes/notifications");
const workspacesRouter = require("./routes/workspaces");
const { Message } = require("./models/Messages");
const expressAsyncHandler = require("express-async-handler");

app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/workspaces", workspacesRouter);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Initialize socket.io server

// Endpoint to delete all messages
app.delete(
  "/api/deleteAll",
  expressAsyncHandler(async (req, res) => {
    try {
      await Message.deleteMany();
      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  })
);


// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export app for testing purposes
