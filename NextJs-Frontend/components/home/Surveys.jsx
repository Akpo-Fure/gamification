import StyledTable from "../shared/Table";

const Surveys = () => {
  return (
    <StyledTable
      title="Surveys"
      labels={[
        "Title",
        "Description",
        "No Of Questions",
        "Expected Time",
        "Reward Points",
        "Status",
        "",
      ]}
      bodyRows={[]}
    />
  );
};

export default Surveys;
