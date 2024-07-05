import API from "@/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL = "/auth/";

export function useRegister() {
  const createUser = async (data) => {
    const res = await API.post(`${URL}signup`, data);
    return res;
  };
  const mutation = useMutation({
    mutationFn: createUser,
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

  return mutation;
}

export function useVerifyEmail(email, token) {
  const verifyEmail = async (data) => {
    const res = await API.patch(`${URL}verifyemail/${email}/${token}`, data);
    return res;
  };

  const mutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (res) => {
      toast.success(res.data.message || "Email verified successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useResendVerificationEmail() {
  const resendVerificationEmail = async (data) => {
    const res = await API.patch(`${URL}resendemailverification`, data);
    return res;
  };

  const mutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (res) => {
      toast.success(res.data.message || "Verification email sent successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useLogin() {
  const login = async (data) => {
    const res = await API.post(`${URL}login`, data);
    return res;
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.user));
      toast.success(res.data?.message || "Logged in successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useForgotPassword() {
  const forgotPassword = async (data) => {
    const res = await API.patch(`${URL}forgotpassword`, data);
    return res;
  };

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (res) => {
      toast.success(
        res.data?.message || "Check your email to reset your password"
      );
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useResetPassword(userId, token) {
  const resetPassword = async (data) => {
    const res = await API.patch(`${URL}resetpassword/${userId}/${token}`, data);
    return res;
  };

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      toast.success(res.data?.message || "Password reset successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}

export function useLogout() {
  const queryClient = useQueryClient();

  const logout = async () => {
    const res = await API.post(`${URL}logout`);
    return res;
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      window.location.replace("/auth/login");
      queryClient.clear();
      Cookies.remove("token");
      Cookies.remove("user");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return mutation;
}
