import { z } from "zod";
import { CreateSurveySchema, AnswerSurveySchema } from "../validation";

type CreateSurveyDto = z.infer<typeof CreateSurveySchema>;
type AnswerSurveyDto = z.infer<typeof AnswerSurveySchema>;

export { CreateSurveyDto, AnswerSurveyDto };
