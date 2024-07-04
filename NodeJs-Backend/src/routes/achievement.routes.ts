import express from "express";
import { AchievementController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = express.Router();

router.get("/", AuthMiddleware, AchievementController.getAchievements);

export default router;
