import express from "express";
import { LeaderboardController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = express.Router();

router.get("/", AuthMiddleware, LeaderboardController.getLeaderboard);

export default router;
