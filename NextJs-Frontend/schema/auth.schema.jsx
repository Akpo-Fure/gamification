import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  name: yup.string().required().min(3).trim(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
  referralCode: yup.string(),
});

const LoginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email().required(),
});

const ResetPasswordSchema = yup.object().shape({
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});

export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
};
