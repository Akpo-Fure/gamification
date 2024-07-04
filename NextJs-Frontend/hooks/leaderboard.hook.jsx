import API from "@/api";
import { useQuery } from "@tanstack/react-query";

const URL = "/leaderboard";

export function useGetLeaderboard(enabled) {
  const getLeaderboard = async () => {
    const res = await API.get(`${URL}`);
    return res;
  };

  const query = useQuery({
    enabled,
    queryFn: getLeaderboard,
    queryKey: ["GetLeaderboard"],
  });

  return query;
}
