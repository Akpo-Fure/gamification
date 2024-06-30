import API from "@/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL = "/auth/";

export function useRegister() {
  return useMutation((data) => API.post(`${URL}signup`, data), {
    onSuccess: (res) => {
      toast.success(
        res.data?.message ||
          "User registered successfully, check your email to verify your account"
      );
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useLogin() {
  return useMutation((data) => API.post(`${URL}login`, data), {
    onSuccess: (res) => {
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      toast.success(res.data?.message || "Logged in successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation(() => API.post(`${URL}logout`), {
    onSuccess: () => {
      Cookies.remove("token");
      Cookies.remove("user");
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation((data) => API.post(`${URL}forgotpassword`, data), {
    onSuccess: (res) => {
      toast.success(
        res.data?.message || "Check your email to reset your password"
      );
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useResetPassword(userId, token) {
  return useMutation(
    (data) => API.post(`${URL}resetpassword/${userId}/${token}`, data),
    {
      onSuccess: (res) => {
        toast.success(res.data?.message || "Password reset successfully");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );
}
