import express from "express";
import authRoute from "./auth.routes";
import surveyRoute from "./survey.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/survey", surveyRoute);

export default router;
