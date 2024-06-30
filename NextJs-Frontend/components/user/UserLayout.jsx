import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  width: 450px;
  margin: auto;
`;

const UserLayout = ({ children }) => {
  return (
    <Container>
      <Wrapper>
        {" "}
        <h3>Welcome to Gamification</h3>
        {children}
      </Wrapper>
    </Container>
  );
};

export default UserLayout;
