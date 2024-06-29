import { z } from "zod";
import { questionTypes } from "../constants";

const CreateSurveySchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  startDate: z
    .date()
    .refine((date) => date.setHours(0) < new Date().setHours(0), {
      message: "Start date cannot be in the past",
    }),
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
        options: z.array(
          z.object({
            option: z.string().min(3).max(255),
          })
        ),
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

export { CreateSurveySchema };
