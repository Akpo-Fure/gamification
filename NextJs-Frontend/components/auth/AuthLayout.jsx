import styled, { createGlobalStyle } from "styled-components";
import colors from "@/constants/colors";
import fontSizes from "@/constants/fontsizes";
import device from "@/constants/brakpoints";

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    width: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    background: ${colors.brandBG_light};;
    position: absolute;
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-color: ${colors.brandBG_light};
  margin: 0;
  padding: 0;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin: auto;
  padding: 2em;
`;

const Title = styled.p`
  color: ${colors.text100_grey};
  font-size: ${fontSizes.xxxl};
  font-weight: 600;
  color: ${colors.text100_light};

  @media ${device.desktop} {
    font-size: ${fontSizes.xxl};
  }

  @media ${device.mobile} {
    font-size: ${fontSizes.xl};
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 100%;
  min-width: 450px;

  @media ${device.mobile} {
  }
`;

const AuthLayout = ({ children, title }) => {
  return (
    <Container>
      <GlobalStyle />
      <Wrapper>
        <Title>{title}</Title>
        <Box>
          <FormArea>{children}</FormArea>
        </Box>
      </Wrapper>
    </Container>
  );
};

export default AuthLayout;
