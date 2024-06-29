import mongoose from "mongoose";
import { questionTypes } from "../constants";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(questionTypes),
    },
    options: [String],
    isRequired: { type: Boolean, required: true, default: false },
    answer: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true, _id: false }
);

const participantSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: { type: [questionSchema], required: true },
  },
  { timestamps: true, _id: false }
);

const surveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    participants: [participantSchema],
    questions: { type: [questionSchema], required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isClosed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);

export default Survey;
