import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
  referralCode: yup.string(),
});

export { RegisterSchema };
