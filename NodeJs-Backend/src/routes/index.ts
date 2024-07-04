import express from "express";
import authRoute from "./auth.routes";
import surveyRoute from "./survey.routes";
import userRoute from "./user.routes";
import adminRoute from "./admin.routes";
import achievementRoute from "./achievement.routes";
import leaderboardRoute from "./leaderboard.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/survey", surveyRoute);
router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/achievement", achievementRoute);
router.use("/leaderboard", leaderboardRoute);

export default router;
