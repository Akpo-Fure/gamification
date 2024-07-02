import express from "express";
import authRoute from "./auth.routes";
import surveyRoute from "./survey.routes";
import userRoute from "./user.routes";
import adminRoute from "./admin.routes";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/survey", surveyRoute);
router.use("/user", userRoute);
router.use("/admin", adminRoute);

export default router;
