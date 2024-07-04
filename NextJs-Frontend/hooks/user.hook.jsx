import API from "@/api";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const URL = "/user/";

export function useGetUser(hasCookie) {
  const getUser = async () => {
    const res = await API.get(`${URL}me`);
    Cookies.set("user", res.data.user ? JSON.stringify(res.data.user) : null);
    return res.data.user;
  };

  const query = useQuery({
    enabled: hasCookie,
    queryFn: getUser,
    queryKey: ["GetUser"],
    refetchOnWindowFocus: "always",
  });

  return query;
}

export function useLoggedInUser() {
  let hasCookie = Cookies.get("user");
  if (hasCookie) {
    hasCookie = true;
  } else {
    hasCookie = false;
  }
  const { data } = useGetUser(hasCookie);
  const user = data ? JSON.stringify(data) : Cookies.get("user");
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
  }, [user, data]);
}
