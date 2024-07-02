import {
  useRegister,
  useLogin,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useResendVerificationEmail,
  useVerifyEmail,
} from "./auth.hook";
import { useGetUser, useLoggedInUser } from "./user.hook";
import useResponsive from "./useResponsive";

export {
  useRegister,
  useLogin,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useGetUser,
  useLoggedInUser,
  useResendVerificationEmail,
  useVerifyEmail,
  useResponsive,
};
