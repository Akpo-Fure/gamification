import { z } from "zod";
import {
  LoginUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignupUserSchema,
  ResendEmailVerificationSchema,
} from "../validation/auth.validator";

type LoginUserDto = z.infer<typeof LoginUserSchema>;
type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
type SignupUserDto = z.infer<typeof SignupUserSchema>;
type ResendEmailVerificationDto = z.infer<typeof ResendEmailVerificationSchema>;

export {
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignupUserDto,
  ResendEmailVerificationDto,
};
