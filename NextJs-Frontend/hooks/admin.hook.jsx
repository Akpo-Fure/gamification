import API from "@/api";
import { useQuery } from "@tanstack/react-query";

const URL = "/admin/";

export function useGetUsers() {
  const getUsers = async () => {
    const res = await API.get(`${URL}users`);
    return res;
  };

  const query = useQuery({
    queryFn: getUsers,
    queryKey: ["GetUsers"],
  });

  return query;
}

export function useGetAdminSurveys() {
  const getSurveys = async () => {
    const res = await API.get(`${URL}surveys`);
    return res;
  };

  const query = useQuery({
    queryFn: getSurveys,
    queryKey: ["GetSurveys"],
  });

  return query;
}
