import { useGetUsers } from "@/hooks";
import { useMemo } from "react";
import StyledTable from "../shared/Table";
import { AdminAuth } from "../auth";

const Users = () => {
  const { data, isLoading } = useGetUsers();

  const bodyRows = useMemo(() => {
    if (data) {
      return data?.data?.map((user) => [
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {user?.name}
        </span>,
        user?.email,
        user?.surveysAnswered,
        user?.isAdmin ? "Admin" : "User",
        user?.isVerified ? "Yes" : "No",
        user?.isOnline ? "Online" : "Offline",
        "",
      ]);
    }
    return [];
  }, [data]);

  return (
    <StyledTable
      title="Users"
      labels={[
        "Name",
        "Email",
        "Surveys Answered",
        "Role",
        "Verified",
        "Online Status",
        "",
      ]}
      bodyRows={bodyRows}
      isTableLoading={isLoading}
      minWidth="740px"
    />
  );
};

export default AdminAuth(Users);
