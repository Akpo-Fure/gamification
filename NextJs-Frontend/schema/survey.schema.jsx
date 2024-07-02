import * as yup from "yup";
import { questionTypes } from "@/constants/enums";

const today = new Date();
today.setHours(0, 0, 0, 0);

const CreateSurveySchema = yup.object().shape({
  title: yup.string().min(3).max(255).required().trim(),
  description: yup.string().min(3).max(255).required().trim(),
  startDate: yup
    .date()
    .test(
      "is-future-date",
      "Start date cannot be in the past",
      (value) => value && value.setHours(0, 0, 0, 0) > today
    )
    .required(),
  expectedTime: yup
    .number()
    .integer()
    .positive()
    .max(60, "Cannot be more than 60 minutes")
    .required(),
  reward: yup
    .number()
    .integer()
    .positive()
    .max(100, "Cannot be more than 100")
    .required(),
  questions: yup
    .array()
    .min(1, "Survey must have at least 1 question")
    .of(
      yup.object().shape({
        question: yup.string().min(3).max(255).required().trim(),
        type: yup.mixed().oneOf(Object.values(questionTypes)).required(),
        options: yup
          .array()
          .of(yup.string().required().trim())
          .when("type", {
            is: (type) => type !== questionTypes.TEXT_INPUT,
            then: (schema) =>
              schema.min(2, "Options must be at least 2").required(),
            otherwise: (schema) => schema.required(),
          }),
        isRequired: yup.boolean().required(),
      })
    )
    .required(),
});

const AddQuestionSchema = yup.object().shape({
  question: yup.string().min(3).max(255).required(),
  type: yup.mixed().oneOf(Object.values(questionTypes)).required(),
  options: yup
    .array()
    .of(yup.string().required().trim())
    .when("type", {
      is: (type) => type !== questionTypes.TEXT_INPUT,
      then: (schema) => schema.min(2, "Options must be at least 2").required(),
      otherwise: (schema) => schema.required(),
    }),
  isRequired: yup.boolean().required(),
});

export { CreateSurveySchema, AddQuestionSchema };
