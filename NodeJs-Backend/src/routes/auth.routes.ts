import express from "express";
import { AuthController } from "../controllers";
import { validationMiddleware } from "../middlewares";
import { CreateUserDto, LoginUserDto } from "../dto";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(CreateUserDto),
  AuthController.signup
);

router.post("/login", validationMiddleware(LoginUserDto), AuthController.login);

export default router;
