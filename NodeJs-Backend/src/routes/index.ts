import express from "express";
import authRoute from "./auth.routes";
import surveyRoute from "./survey.routes";
import userRoute from "./user.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/survey", surveyRoute);
router.use("/user", userRoute);

export default router;
