import { z } from "zod";
import { questionTypes } from "../constants";

const CreateSurveySchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  startDate: z.string().refine((value) => !isNaN(Date.parse(value))),
  expectedTime: z
    .number()
    .int()
    .positive()
    .max(60, { message: "cannot be more than 60 minutes" }),
  reward: z
    .number()
    .int()
    .positive()
    .max(100, { message: "cannot be more than 100" }),
  questions: z
    .array(
      z.object({
        question: z.string().min(3).max(255),
        type: z.enum(Object.values(questionTypes) as [string, ...string[]]),
        options: z.array(z.string().min(1).max(255)),
        isRequired: z.boolean(),
      })
    )
    .superRefine((values, ctx) => {
      values.forEach((question, index) => {
        if (
          question.type !== questionTypes.TEXT_INPUT &&
          question.options.length < 2
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Options must be at least 2",
            path: ["questions", index, "options"],
          });
        }
      });
      return values;
    }),
});

const AnswerSurveySchema = z.object({
  answers: z
    .array(
      z.object({
        question: z.string().min(3).max(255),
        type: z.enum(Object.values(questionTypes) as [string, ...string[]]),
        options: z.array(z.string().min(1).max(255)),
        isRequired: z.boolean(),
        answer: z.union([z.string().min(1).max(255), z.array(z.string())]),
      })
    )
    .superRefine((values, ctx) => {
      values.forEach((answer, index) => {
        if (
          answer.type !== questionTypes.TEXT_INPUT &&
          answer?.answer.length === 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Answer is required",
            path: ["answers", index, "answer"],
          });
        }
        if (
          answer.type !== questionTypes.MULTIPLE_CHOICE &&
          answer?.answer === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Answer is required",
            path: ["answers", index, "answer"],
          });
        }
      });
      return values;
    }),
});

export { CreateSurveySchema, AnswerSurveySchema };
