import { useMemo } from "react";
import StyledTable from "../shared/Table";
import { useRealTime } from "@/context/Realtime.context";

const Achievements = () => {
  const { achievements } = useRealTime();

  const bodyRows = useMemo(() => {
    if (achievements) {
      return achievements?.map((achievement) => [
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {achievement?.name}
        </span>,
        achievement?.description,
        achievement?.createdAt?.split("T")[0],
        "",
      ]);
    }
    return [];
  }, [achievements]);

  return (
    <StyledTable
      title="Achievements"
      labels={["Name", "Description", "Date Achieved", ""]}
      bodyRows={bodyRows || []}
      minWidth="740px"
    />
  );
};

export default Achievements;
