"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.getAllUsers = exports.removeUser = exports.getCurrentUser = exports.addUser = void 0;
var users = [];
var addUser = function (user) {
    users.push(user);
    return user;
};
exports.addUser = addUser;
var getCurrentUser = function (id) {
    return users.find(function (user) { return user.id === id; });
};
exports.getCurrentUser = getCurrentUser;
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.id === id; });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
var getAllUsers = function (quizId) {
    return users.filter(function (user) { return user.quizId === quizId; });
};
exports.getAllUsers = getAllUsers;
var updateUserStatus = function (id, _a) {
    var status = _a.status;
    var user = users.find(function (user) { return user.id === id; });
    if (user)
        user.status = status;
    return user;
};
exports.updateUserStatus = updateUserStatus;
