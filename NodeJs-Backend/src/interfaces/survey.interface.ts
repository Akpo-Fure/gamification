import { ObjectId } from "mongoose";
import { questionTypes } from "../constants";

interface IQuestion {
  question: string;
  type: (typeof questionTypes)[keyof typeof questionTypes];
  options?: string[];
  isRequired: boolean;
  answer?: any;
}

interface IParticipant {
  participant: ObjectId;
  answers: IQuestion[];
}

interface ISurvey {
  title: string;
  description: string;
  startDate: Date;
  participants?: IParticipant[];
  questions: IQuestion[];
  expectedTime: number;
  reward: number;
  createdBy: ObjectId;
  isClosed: boolean;
}

export { IQuestion, IParticipant, ISurvey };
