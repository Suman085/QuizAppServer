import { IQuiz } from "../../interfaces/IQuiz";
import { IUser } from "../../interfaces/IUser";

interface IAppQuiz extends IQuiz {
  status: "waiting" | "started" | "completed" | "terminated";
  users: IUser[];
  winner?: IUser;
}

const allQuiz: IAppQuiz[] = [];

export const quizUserMap: { [socketId: string]: string } = {};

export const addQuiz = (quiz: IAppQuiz) => {
  allQuiz.push(quiz);
  return quiz;
};

export const removeQuiz = (id: string) => {
  const index = allQuiz.findIndex((quiz) => quiz.id === id);
  if (index !== -1) {
    return allQuiz.splice(index, 1)[0];
  }
};

export const getAllQuiz = () => {
  return allQuiz;
};

export const addUserInQuiz = (quizId: string, user: IUser) => {
  const quiz = allQuiz.find((quiz) => quiz.id === quizId);
  if (quiz) {
    quiz.users.push(user);
  }
  return quiz;
};

export const removeSocketFromQuiz = (quizId: string, userId: string) => {
  const quiz = allQuiz.find((quiz) => quiz.id === quizId);
  if (quiz) {
    quiz.users = [...quiz.users.filter((user) => user.id !== userId)];
  }
  return quiz;
};

export const removeUserFromQuiz = (quizId: string, username: string) => {
  const quiz = allQuiz.find((quiz) => quiz.id === quizId);
  if (quiz) {
    quiz.users = [...quiz.users.filter((user) => user.username !== username)];
  }
  return quiz;
};

export const updateUserStatus = (
  quizId: string,
  userId: string,
  { status }: { status: "ready" | "waiting" }
) => {
  const quiz = allQuiz.find((quiz) => quiz.id === quizId);
  if (quiz) {
    quiz.users
      .filter((user) => user.id === userId)
      .map((user) => (user.status = status));
  }
  return quiz;
};

export const updateUserName = (
  quizId: string,
  userId: string,
  newName: string
) => {
  const quiz = allQuiz.find((quiz) => quiz.id === quizId);
  if (quiz) {
    quiz.users
      .filter((user) => user.id === userId)
      .map((user) => (user.username = newName));
  }
  return quiz;
};
