import { Server } from "socket.io";
import http from "http";
import express from "express";

import { v4 } from "uuid";
import {
  addQuiz,
  addUserInQuiz,
  quizUserMap,
  removeSocketFromQuiz,
  removeUserFromQuiz,
  updateUserName,
  updateUserStatus,
} from "./data/quiz";
import { IUser } from "./interfaces/IUser";
import { generateAvatarUrl } from "./utils";

var app = express();
app.use(express.static(__dirname + "/"));

// Note: manage connections... not users. :D
const server = http.createServer(app);
const io = new Server(server);

app.post("/quiz", (req, res) => {
  //{topic}
  //generate quiz id
  res.send("hello world");
});

server.listen(process.env.PORT || 5000);
// io.on("connection", (socket) => {
//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);
//     if (user) {
//       io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
//     }
//   });
//   socket.on("logout", () => {
//     const user = removeUser(socket.id);
//     if (user) {
//       socket.leave(user.quizId);
//       io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
//     }
//   });
//   socket.on("login", ({ username, quizId, avatar, topic }) => {
//     addUser({
//       id: socket.id,
//       username,
//       quizId,
//       avatar,
//       status: "Waiting",
//       topic,
//     });
//     socket.join(quizId);
//     io.to(quizId).emit("allUsers", { users: getAllUsers(quizId) });
//   });
//   socket.on("loadUsers", () => {
//     const user = getCurrentUser(socket.id);
//     if (user) socket.emit("allUsers", { users: getAllUsers(user.quizId) });
//   });
//   socket.on("readyForQuiz", () => {
//     const user = updateUserStatus(socket.id, { status: "Ready" });
//     if (user)
//       io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
//   });
//   socket.on("waitForQuiz", () => {
//     const user = updateUserStatus(socket.id, { status: "Waiting" });
//     if (user)
//       io.to(user.quizId).emit("allUsers", { users: getAllUsers(user.quizId) });
//   });
// });

/**
 * login
 * -> a user with random name will be created
 * -> for selected topic,create quiz with unique id,
 * -> Create link for that quiz
 * -> Store in quiZ object
 * -> Add the user in that quiz object
 * -> Any user that joins the link will get a random generated name+avatar
 * -> that user will be added to the quiz Server
 * -> User is able to edit their name.
 *
 */

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const quizId = quizUserMap[socket.id];
    const quiz = removeSocketFromQuiz(quizId, socket.id);
    if (quiz) {
      socket.leave(quizId);
      io.to(quizId).emit("allUsers", { users: quiz.users });
    }
  });
  socket.on("logout", ({ quizId, username }) => {
    const quiz = removeUserFromQuiz(quizId, username);
    if (quiz) {
      socket.leave(quizId);
      io.to(quizId).emit("allUsers", { users: quiz.users });
    }
  });
  socket.on("createQuiz", ({ username, topic }) => {
    const quizId = v4();
    const link = process.env.BASE_URL + `/quizId=${quizId}`;
    const quiz = addQuiz({
      id: quizId,
      link,
      status: "waiting",
      topic,
      users: [],
      questions: [],
    });
    socket.join(quizId);
    socket.emit("onQuizCreated", quiz);
  });
  socket.on("login", ({ quizId, user }) => {
    const _user: IUser = user ?? {
      avatar: generateAvatarUrl(),
      id: socket.id,
      status: "waiting",
      username: `Player ${Date.now().toString()}`,
    };
    quizUserMap[socket.id] = quizId;
    const quiz = addUserInQuiz(quizId, _user);
    socket.join(quizId);
    socket.emit("onLoggedIn", _user);
    io.to(quizId).emit("allUsers", { users: quiz?.users });
  });

  socket.on("readyForQuiz", ({ quizId }) => {
    const quiz = updateUserStatus(quizId, socket.id, { status: "ready" });
    if (quiz) io.to(quizId).emit("allUsers", { users: quiz.users });
  });
  socket.on("updateUsername", ({ quizId, name }) => {
    const quiz = updateUserName(quizId, socket.id, name);
    if (quiz) io.to(quizId).emit("allUsers", { users: quiz.users });
  });
  socket.on("waitForQuiz", ({ quizId }) => {
    const quiz = updateUserStatus(quizId, socket.id, { status: "waiting" });
    if (quiz) io.to(quizId).emit("allUsers", { users: quiz.users });
  });
});
