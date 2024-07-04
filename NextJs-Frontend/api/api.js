import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      toast.error("Session expired. Please login again.");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default API;
