const Layout = ({ children }) => {
  const { isTablet, isMobile, isLaptop } = useResponsive();

  return (
    <FlexColumn>
      <InnerFlexColumn>
        <Main isMobile={isMobile} isTablet={isTablet} isLaptop={isLaptop}>
          {children}
        </Main>
      </InnerFlexColumn>
    </FlexColumn>
  );
};

export default Layout;
