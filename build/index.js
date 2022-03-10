"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var users_1 = require("./users");
// Note: manage connections... not users. :D
var server = http_1.default.createServer();
var io = new socket_io_1.Server(server);
io.on("connection", function (socket) {
    socket.on("disconnect", function () {
        var user = (0, users_1.removeUser)(socket.id);
        if (user) {
            io.to(user.quizId).emit("allUsers", { users: (0, users_1.getAllUsers)(user.quizId) });
        }
    });
    socket.on("logout", function () {
        var user = (0, users_1.removeUser)(socket.id);
        if (user) {
            socket.leave(user.quizId);
            io.to(user.quizId).emit("allUsers", { users: (0, users_1.getAllUsers)(user.quizId) });
        }
    });
    socket.on("login", function (_a) {
        var username = _a.username, quizId = _a.quizId, avatar = _a.avatar, topic = _a.topic;
        (0, users_1.addUser)({
            id: socket.id,
            username: username,
            quizId: quizId,
            avatar: avatar,
            status: "Waiting",
            topic: topic,
        });
        socket.join(quizId);
        io.to(quizId).emit("allUsers", { users: (0, users_1.getAllUsers)(quizId) });
    });
    socket.on("loadUsers", function () {
        var user = (0, users_1.getCurrentUser)(socket.id);
        if (user)
            socket.emit("allUsers", { users: (0, users_1.getAllUsers)(user.quizId) });
    });
    socket.on("readyForQuiz", function () {
        var user = (0, users_1.updateUserStatus)(socket.id, { status: "Ready" });
        if (user)
            io.to(user.quizId).emit("allUsers", { users: (0, users_1.getAllUsers)(user.quizId) });
    });
    socket.on("waitForQuiz", function () {
        var user = (0, users_1.updateUserStatus)(socket.id, { status: "Waiting" });
        if (user)
            io.to(user.quizId).emit("allUsers", { users: (0, users_1.getAllUsers)(user.quizId) });
    });
});
server.listen(8000, function () {
    console.log("listening on *:8000");
});
