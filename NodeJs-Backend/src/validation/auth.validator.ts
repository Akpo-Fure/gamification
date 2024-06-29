import { z } from "zod";

const SignupUserSchema = z
  .object({
    name: z.string().min(3).max(255).trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
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

export {
  SignupUserSchema,
  LoginUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
};
