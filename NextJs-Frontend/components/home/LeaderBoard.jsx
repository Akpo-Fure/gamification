import { useMemo } from "react";
import StyledTable from "../shared/Table";
import { useRealTime } from "@/context/Realtime.context";

const Leaderboard = () => {
  const { leaderboard } = useRealTime();

  const bodyRows = useMemo(() => {
    if (leaderboard) {
      return leaderboard?.map((user) => [
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {user?.name}
        </span>,
        user?.points,
        "",
      ]);
    }
    return [];
  }, [leaderboard]);

  return (
    <StyledTable
      title="Leaderboard"
      labels={["Name", "Points", ""]}
      bodyRows={bodyRows || []}
      minWidth="740px"
    />
  );
};

export default Leaderboard;
