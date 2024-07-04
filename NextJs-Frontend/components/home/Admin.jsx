import { useState, useEffect, Children } from "react";
import { useRouter } from "next/router";
import { useResponsive } from "@/hooks";
import { Users, Surveys, Leaderboard } from ".";
import {
  FlexColumn,
  FlexRow,
  FlexColumn2,
  TransparentButton,
  InnerFlexColumn,
  Main,
} from "./Home";
import { AdminAuth } from "../auth";
import next from "next";
// import Surveys from "./Surveys";

const Admin = () => {
  const router = useRouter();
  const { isTablet, isMobile, isLaptop } = useResponsive();
  const [active, setActive] = useState("users");

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
      title: "Leaderboard",
      tab: "leaderboard",
      isAdminTab: false,
      content: Leaderboard,
    },
  ];

  const { tab } = router.query;

  const handleTabChange = (tab) => {
    router.push({
      pathname: "/home",
      query: { tab: "admin", children: tab },
    });

    setActive(tab);
  };

  const { children } = router.query;

  useEffect(() => {
    if (children) {
      setActive(children);
    }
  }, [children]);

  return (
    <>
      <FlexColumn2>
        <InnerFlexColumn>
          <Main isMobile={isMobile} isTablet={isTablet} isLaptop={isLaptop}>
            <div>
              <FlexRow>
                {tabs.map((tab, key) => {
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
              <div>{active === "users" && <Users />}</div>
              <div>{active === "surveys" && <Surveys />}</div>
              <div>{active === "leaderboard" && <Leaderboard />} </div>
            </div>
          </Main>
        </InnerFlexColumn>
      </FlexColumn2>
    </>
  );
};

export default AdminAuth(Admin);
