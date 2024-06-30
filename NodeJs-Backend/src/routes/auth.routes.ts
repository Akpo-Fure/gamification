import express from "express";
import { AuthController } from "../controllers";
import { validationMiddleware, AuthMiddleware } from "../middlewares";
import {
  SignupUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ResendEmailVerificationSchema,
} from "../validation";

const router = express.Router();

router.post(
  "/signup",
  validationMiddleware(SignupUserSchema),
  AuthController.signup
);

router.patch(
  "/resendemailverification",
  validationMiddleware(ResendEmailVerificationSchema),
  AuthController.resendEmailVerification
);

router.patch("/verifyemail/:email/:token", AuthController.verifyEmail);

router.post(
  "/login",
  validationMiddleware(LoginUserSchema),
  AuthController.login
);

router.post("/logout", AuthMiddleware, AuthController.logout);

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
