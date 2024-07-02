import StyledTable from "../shared/Table";

const Users = () => {
  return (
    <StyledTable
      title="Users"
      labels={["Name", "Email", "Role", "Verified", ""]}
      bodyRows={[]}
    />
  );
};

export default Users;
