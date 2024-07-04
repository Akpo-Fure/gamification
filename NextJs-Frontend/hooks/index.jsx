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
import { useGetUsers, useGetAdminSurveys } from "./admin.hook";
import {
  useCreateSurvey,
  useGetActiveSurveys,
  useAnswerSurvey,
} from "./survey.hook";
import { useGetAchievements } from "./achievement.hook";
import { useGetLeaderboard } from "./leaderboard.hook";

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
  useGetUsers,
  useCreateSurvey,
  useGetAdminSurveys,
  useGetActiveSurveys,
  useAnswerSurvey,
  useGetAchievements,
  useGetLeaderboard,
};
