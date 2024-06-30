import express from "express";
import { UserController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

const router = express.Router();

router.get("/me", AuthMiddleware, UserController.getUser);

export default router;
