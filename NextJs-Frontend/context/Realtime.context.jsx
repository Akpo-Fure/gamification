import { createContext, use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./Socket.context";
import {
  useLoggedInUser,
  useGetAchievements,
  useGetLeaderboard,
} from "@/hooks";

const RealtimeContext = createContext();

const RealTimeProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const user = useLoggedInUser();
  let isEnabled = false;
  if (user) {
    isEnabled = true;
  }
  const { data, isPending: isAchievementsLoading } =
    useGetAchievements(isEnabled);
  const { data: leaderboardData, isPending: isLeaderboardLoading } =
    useGetLeaderboard(isEnabled);
  const socket = useSocket();
  const [points, setPoints] = useState(user?.points);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (data?.data?.achievements) {
      setAchievements(data.data.achievements);
    }
  }, [data, isAchievementsLoading]);

  useEffect(() => {
    if (leaderboardData?.data?.leaderboard) {
      setLeaderboard(leaderboardData.data.leaderboard);
    }
  }, [leaderboardData, isLeaderboardLoading]);

  useEffect(() => {
    socket.on("received_points", (points) => {
      // toast.success(`Congratulations: You received ${points} points!`);
    });

    return () => {
      socket.off("received_points");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("total_points", (data) => {
      setPoints(data);
      queryClient.invalidateQueries("GetUser");
    });

    return () => {
      socket.off("total_points");
    };
  }, [socket, queryClient]);

  useEffect(() => {
    socket.on("new_achievement", (achievement) => {
      toast.info(
        `Congratulations: You received a new achievement!: ${achievement.name}`
      );
      setAchievements((prev) => [...prev, achievement]);
      queryClient.invalidateQueries("GetAchievements");
    });
  }, [socket, queryClient]);

  useEffect(() => {
    socket.on("new_leaderboard", (leaderboard) => {
      setLeaderboard(leaderboard);
      queryClient.invalidateQueries("GetLeaderboard");
    });
  }, [socket, queryClient]);

  return (
    <RealtimeContext.Provider
      value={{
        points,
        achievements,
        isAchievementsLoading,
        leaderboard,
        isLeaderboardLoading,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

const useRealTime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealTime must be used within RealTimeProvider");
  }
  return context;
};

export { RealTimeProvider, useRealTime };
