import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useResponsive } from "@/hooks";
import { useRouter } from "next/router";
import { useLoggedInUser } from "@/hooks";
import { Users, Surveys, Layout } from ".";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2em;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0em;
`;

const TransparentButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${({ active }) => (active ? "#E86217" : "#B5B5B5")};
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  padding: 0.5em;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e8e8e8;
  }
`;

const FlexColumn2 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 1em;
`;

const InnerFlexColumn = styled(FlexColumn)`
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: hidden;
  gap: 0em;
`;

const Main = styled.main`
  ${({ isMobile, isTablet, isLaptop }) => css`
    padding: ${isMobile
      ? "1em 0.5em"
      : isTablet
      ? "1em 1.5em"
      : isLaptop
      ? "1em"
      : "2em 2.5em"};
    overflow-y: auto;
  `}
`;

const Home = () => {
  const user = useLoggedInUser();
  const { isTablet, isMobile, isLaptop } = useResponsive();
  const isAdmin = user?.isAdmin === true;

  const router = useRouter();
  const [active, setActive] = useState("home");
  const { tab } = router.query;
  useEffect(() => {
    if (tab) {
      setActive(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (!isAdmin) {
      setActive("surveys");
    }
  }, [isAdmin]);

  const handleTabChange = (tab) => {
    setActive(tab);
    router.push(`/home?tab=${tab}`);
  };

  const tabs = [
    {
      title: "Users",
      tab: "users",
      isAdminTab: true,
      content: Users,
    },
    {
      title: "Surveys",
      tab: "surveys",
      isAdminTab: false,
      content: Surveys,
    },
    {
      title: "Achievements",
      tab: "achievements",
      isAdminTab: false,
      content: () => <div>Achievements</div>,
    },
    {
      title: "Badges",
      tab: "badges",
      isAdminTab: false,
      content: () => <div>Badges</div>,
    },
  ];

  return (
    <>
      <FlexColumn2>
        <InnerFlexColumn>
          <Main isMobile={isMobile} isTablet={isTablet} isLaptop={isLaptop}>
            <div>
              <FlexRow>
                {tabs.map((tab, key) => {
                  if (tab.isAdminTab && !isAdmin) {
                    return null;
                  }
                  return (
                    <FlexColumn key={tab.title}>
                      <TransparentButton
                        active={active === tab.tab}
                        onClick={() => handleTabChange(tab.tab)}
                      >
                        {tab.title}
                      </TransparentButton>
                    </FlexColumn>
                  );
                })}
              </FlexRow>
              {/* <div>{tabs.find((tab) => tab.tab === active)?.content()}</div>
               */}
              <div>{active === "users" && <Users />}</div>
              <div>{active === "surveys" && <Surveys />}</div>
              <div>{active === "achievements" && <div>Achievements</div>}</div>
              <div>{active === "badges" && <div>Badges</div>}</div>
            </div>
          </Main>
        </InnerFlexColumn>
      </FlexColumn2>
    </>
  );
};

export default Home;
