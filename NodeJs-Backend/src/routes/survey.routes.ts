import express from "express";
import { SurveyController } from "../controllers";
import { validationMiddleware, AuthMiddleware } from "../middlewares";
import { CreateSurveySchema } from "../validation";

const router = express.Router();

router.post(
  "/create",
  validationMiddleware(CreateSurveySchema),
  AuthMiddleware,

  SurveyController.createSurvey
);

export default router;
