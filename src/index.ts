import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  addUser,
  getAllUsers,
  updateUserStatus,
  removeUser,
  getCurrentUser,
} from "./users";
import { v5 } from "uuid";

var app = express();
app.use(express.static(__dirname + "/"));

// Note: manage connections... not users. :D
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(process.env.PORT || 5000);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
    }
  });
  socket.on("logout", () => {
    const user = removeUser(socket.id);
    if (user) {
      socket.leave(user.quizId);
      io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
    }
  });
  socket.on("login", ({ username, quizId, avatar, topic }) => {
    addUser({
      id: socket.id,
      username,
      quizId,
      avatar,
      status: "Waiting",
      topic,
    });
    socket.join(quizId);
    io.to(quizId).emit("allUsers", { users: getAllUsers(quizId) });
  });
  socket.on("loadUsers", () => {
    const user = getCurrentUser(socket.id);
    if (user) socket.emit("allUsers", { users: getAllUsers(user.quizId) });
  });
  socket.on("readyForQuiz", () => {
    const user = updateUserStatus(socket.id, { status: "Ready" });
    if (user)
      io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
  });
  socket.on("waitForQuiz", () => {
    const user = updateUserStatus(socket.id, { status: "Waiting" });
    if (user)
      io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
  });
});
