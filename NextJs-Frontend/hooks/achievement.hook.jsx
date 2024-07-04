import API from "@/api";
import { useQuery } from "@tanstack/react-query";

const URL = "/achievement";

export function useGetAchievements(enabled) {
  const getAchievements = async () => {
    const res = await API.get(URL);
    return res;
  };

  const query = useQuery({
    enabled,
    queryFn: getAchievements,
    queryKey: ["GetAchievements"],
  });

  return query;
}
