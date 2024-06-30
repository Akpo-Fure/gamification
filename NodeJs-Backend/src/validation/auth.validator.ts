import { z } from "zod";

const SignupUserSchema = z
  .object({
    name: z.string().min(3).max(255).trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    verificationToken: z.string().optional(),
    verificationTokenExpires: z.date().optional(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const LoginUserSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string(),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

const ResendEmailVerificationSchema = z.object({
  email: z.string().email(),
});

export {
  SignupUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ResendEmailVerificationSchema,
};
