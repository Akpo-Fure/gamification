import express from "express";
import { SurveyController } from "../controllers";
import {
  validationMiddleware,
  AuthMiddleware,
  AdminMiddleware,
} from "../middlewares";
import { CreateSurveySchema, AnswerSurveySchema } from "../validation";

const router = express.Router();

router.post(
  "/create",
  validationMiddleware(CreateSurveySchema),
  AuthMiddleware,
  AdminMiddleware,
  SurveyController.createSurvey
);

router.get("/active", AuthMiddleware, SurveyController.getActiveSurveys);

router.patch(
  "/answer/:id",
  validationMiddleware(AnswerSurveySchema),
  AuthMiddleware,
  SurveyController.answerSurvey
);

export default router;
