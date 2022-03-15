import { IQuestion } from "../interfaces/IQuestion";

export interface IQuiz {
  id: string;
  topic: string;
  link: string;
  questions: IQuestion[];
}
