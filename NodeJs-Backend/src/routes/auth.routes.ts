import express from "express";
import { AuthController } from "../controllers";
import { validationMiddleware } from "../middlewares";
import {
  CreateUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(CreateUserDto),
  AuthController.signup
);

router.post("/login", validationMiddleware(LoginUserDto), AuthController.login);

router.patch(
  "/forgotpassword",
  validationMiddleware(ForgotPasswordDto),
  AuthController.forgotpassword
);

router.patch(
  "/resetpassword/:userId/:token",
  validationMiddleware(ResetPasswordDto),
  AuthController.resetpassword
);

export default router;
