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
