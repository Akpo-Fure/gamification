import { z } from "zod";
import { CreateSurveySchema } from "../validation";

type CreateSurveyDto = z.infer<typeof CreateSurveySchema>;

export { CreateSurveyDto };
