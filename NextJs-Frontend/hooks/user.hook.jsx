import API from "@/api";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const URL = "/user/";

export function useGetUser() {
  const getUser = async () => {
    const res = await API.get(`${URL}me`);
    Cookies.set("user", res.data.user ? JSON.stringify(res.data.user) : null);
    return res.data.user;
  };

  const query = useQuery({
    queryFn: getUser,
    queryKey: ["GetUser"],
  });

  return query;
}

export function useLoggedInUser() {
  const user = Cookies.get("user");
  return useMemo(() => {
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }, [user]);
}
