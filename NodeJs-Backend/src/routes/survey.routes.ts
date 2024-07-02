import express from "express";
import { SurveyController } from "../controllers";
import {
  validationMiddleware,
  AuthMiddleware,
  AdminMiddleware,
} from "../middlewares";
import { CreateSurveySchema } from "../validation";

const router = express.Router();

router.post(
  "/create",
  validationMiddleware(CreateSurveySchema),
  AuthMiddleware,
  AdminMiddleware,
  SurveyController.createSurvey
);

export default router;
