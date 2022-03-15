import { IUser } from "../../interfaces/IUser";

const users: IUser[] = [];

export const addUser = (user: IUser) => {
  users.push(user);
  return user;
};

export const getCurrentUser = (id: string) => {
  return users.find((user) => user.id === id);
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// export const getAllUsers = (quizId: string) => {
//   return users.filter((user) => user.quizId === quizId);
// };

// export const updateUserStatus = (
//   quizId: string,
//   userId: string,
//   { status }: { status: "ready" | "waiting" }
// ) => {
//   const user = users.find((user) => user.id === id);
//   if (user) user.status = status;
//   return user;
// };
