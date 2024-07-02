import express from "express";
import { AuthMiddleware, AdminMiddleware } from "../middlewares";
import { AdminController } from "../controllers";

const router = express.Router();

router.get(
  "/users",
  AuthMiddleware,
  AdminMiddleware,
  AdminController.getAllUsers
);

export default router;