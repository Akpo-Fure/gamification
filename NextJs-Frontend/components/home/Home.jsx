import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { Badge } from "react-bootstrap";
import { useResponsive } from "@/hooks";
import { useRouter } from "next/router";
import { useLoggedInUser, useLogout } from "@/hooks";
import { TransparentButton as Button } from "../shared/Button";
import {
  Users,
  Surveys,
  Layout,
  Admin,
  UserSurveys,
  Achievements,
  Leaderboard,
} from ".";
import { useRealTime } from "@/context/Realtime.context";
import { toast } from "react-toastify";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2em;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0em;
`;

export const TransparentButton = styled.button`
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

export const FlexColumn2 = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 1em;
`;

export const InnerFlexColumn = styled(FlexColumn)`
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow-y: hidden;
  gap: 0em;
`;

export const Main = styled.main`
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
  let { points } = useRealTime();
  const { isTablet, isMobile, isLaptop } = useResponsive();
  const isAdmin = user?.isAdmin === true;

  const router = useRouter();
  const [active, setActive] = useState(isAdmin ? "admin" : "surveys");
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

  const { mutate, isPending } = useLogout();

  const tabs = [
    {
      title: "Admin",
      tab: "admin",
      isAdminTab: true,
      content: Admin,
    },
    {
      title: "Surveys",
      tab: "surveys",
      isAdminTab: false,
      content: UserSurveys,
    },
    {
      title: "Achievements",
      tab: "achievements",
      isAdminTab: false,
      content: Achievements,
    },
    {
      title: "Leaderboard",
      tab: "leaderboard",
      isAdminTab: false,
      content: Leaderboard,
    },
  ];

  const handleCopyReferralLink = () => {
    navigator.clipboard
      .writeText(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/register?ref=${user.referralCode}`
      )
      .then(() => {
        toast.success("Referral link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy referral link");
      });
  };

  const surveysAnswered = user?.surveysAnswered || 0;
  points = user?.points || 0;
  const loginStreak = user?.loginStreak || 0;
  const personsReferred = user?.personsReferred || 0;

  return (
    <>
      <FlexColumn2>
        <InnerFlexColumn>
          <Main isMobile={isMobile} isTablet={isTablet} isLaptop={isLaptop}>
            {!isAdmin && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5em",
                  }}
                >
                  <span>Welcome: {user?.name}</span>
                  <span>Total Points: {points || 0}</span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.5em",
                    }}
                  >
                    <Badge
                      bg={
                        points > 500
                          ? "success"
                          : points > 200
                          ? "primary"
                          : points > 100
                          ? "info"
                          : points > 10
                          ? "secondary"
                          : "secondary"
                      }
                    >
                      Points Level:{" "}
                      {points > 500
                        ? "Platinum"
                        : points > 200
                        ? "Gold"
                        : points > 100
                        ? "Silver"
                        : points > 0
                        ? "Bronze"
                        : "Bronze"}{" "}
                      ({points})
                    </Badge>

                    <Badge
                      bg={
                        surveysAnswered > 100
                          ? "success"
                          : surveysAnswered > 50
                          ? "primary"
                          : surveysAnswered > 20
                          ? "info"
                          : surveysAnswered > 0
                          ? "secondary"
                          : "warning"
                      }
                    >
                      Surveys Level:{" "}
                      {surveysAnswered > 100
                        ? "Master"
                        : surveysAnswered > 50
                        ? "Expert"
                        : surveysAnswered > 20
                        ? "Intermediate"
                        : surveysAnswered > 0
                        ? "Beginner"
                        : "Newbie"}{" "}
                      ({surveysAnswered})
                    </Badge>
                    <Badge
                      bg={
                        loginStreak > 30
                          ? "success"
                          : loginStreak > 15
                          ? "primary"
                          : loginStreak > 7
                          ? "info"
                          : loginStreak > 0
                          ? "secondary"
                          : "info"
                      }
                    >
                      Streak Level:{" "}
                      {loginStreak > 30
                        ? "Legend"
                        : loginStreak > 15
                        ? "Champion"
                        : loginStreak > 7
                        ? "Contender"
                        : loginStreak > 0
                        ? "Participant"
                        : "Newcomer"}{" "}
                      ({loginStreak} days)
                    </Badge>

                    <Badge
                      bg={
                        personsReferred > 10
                          ? "success"
                          : personsReferred > 5
                          ? "primary"
                          : personsReferred > 2
                          ? "info"
                          : personsReferred > 0
                          ? "secondary"
                          : "secondary"
                      }
                    >
                      Referral Level:{" "}
                      {personsReferred > 10
                        ? "Master"
                        : personsReferred > 5
                        ? "Expert"
                        : personsReferred > 2
                        ? "Intermediate"
                        : personsReferred > 0
                        ? "Beginner"
                        : "Newbie"}{" "}
                      ({personsReferred})
                    </Badge>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1em" }}>
                  <Button
                    onClick={handleCopyReferralLink}
                    style={{
                      width: "auto",
                    }}
                  >
                    Copy Referral Link
                  </Button>

                  <Button
                    onClick={mutate}
                    style={{
                      width: "auto",
                    }}
                  >
                    {isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </div>
            )}
            <div>
              <FlexRow>
                {tabs.map((tab) => {
                  if (tab.isAdminTab && !isAdmin) {
                    return null;
                  }
                  if (!tab.isAdminTab && isAdmin) {
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
                      {/* 
                        <Button
                          onClick={mutate}
                          style={{
                            width: "auto",
                          }}
                        >
                          {isPending ? "Logging out..." : "Logout"}
                        </Button> */}
                    </FlexColumn>
                  );
                })}
              </FlexRow>
              <div>{active === "admin" && <Admin />}</div>
              <div>{active === "users" && <Users />}</div>
              <div>{active === "surveys" && <UserSurveys />}</div>
              <div>{active === "achievements" && <Achievements />}</div>
              <div>{active === "leaderboard" && <Leaderboard />}</div>
              <div>{active === "badges" && <div>Badges</div>}</div>
            </div>
          </Main>
        </InnerFlexColumn>
      </FlexColumn2>
    </>
  );
};

export default Home;
