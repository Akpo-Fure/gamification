import express from "express";
import { AuthController } from "../controllers";
import { validationMiddleware } from "../middlewares";
import {
  SignupUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "../validation";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(SignupUserSchema),
  AuthController.signup
);

router.post(
  "/login",
  validationMiddleware(LoginUserSchema),
  AuthController.login
);

router.patch(
  "/forgotpassword",
  validationMiddleware(ForgotPasswordSchema),
  AuthController.forgotpassword
);

router.patch(
  "/resetpassword/:userId/:token",
  validationMiddleware(ResetPasswordSchema),
  AuthController.resetpassword
);

export default router;
