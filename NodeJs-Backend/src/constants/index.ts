const getUser = {
  ID: "ID",
  EMAIL: "EMAIL",
  OPTIONS: "OPTIONS",
};

const questionTypes = {
  MULTIPLE_CHOICE: "multipleChoice",
  SINGLE_CHOICE: "singleChoice",
  TEXT_INPUT: "textInput",
};

const surveyAchievements = [
  {
    title: "First Survey",
    description: "Complete your first survey",
    value: 1,
    points: 50,
  },
  {
    title: "5 Surveys",
    description: "Complete 5 surveys",
    value: 5,
    points: 100,
  },
  {
    title: "10 Surveys",
    description: "Complete 10 surveys",
    value: 10,
    points: 200,
  },
  {
    title: "20 Surveys",
    description: "Complete 20 surveys",
    value: 20,
    points: 500,
  },
  {
    title: "50 Surveys",
    description: "Complete 50 surveys",
    value: 50,
    points: 1000,
  },
  {
    title: "100 Surveys",
    description: "Complete 100 surveys",
    value: 100,
    points: 2000,
  },
  {
    title: "Survey Master",
    description: "Complete 200 surveys",
    value: 200,
    points: 5000,
  },
  {
    title: "Survey King",
    description: "Complete 500 surveys",
    value: 500,
    points: 10000,
  },
  {
    title: "Survey God",
    description: "Complete 1000 surveys",
    value: 1000,
    points: 20000,
  },
  {
    title: "Survey Legend",
    description: "Complete 2000 surveys",
    value: 2000,
    points: 50000,
  },
  {
    title: "Survey Emperor",
    description: "Complete 5000 surveys",
    value: 5000,
    points: 100000,
  },
  {
    title: "Survey Overlord",
    description: "Complete 10000 surveys",
    value: 10000,
    points: 200000,
  },
];

const loginStreakAchievements = [
  {
    title: "Daily Login Streak",
    description: "Login daily for 5 days",
    value: 5,
    points: 50,
  },
  {
    title: "Weekly Login Streak",
    description: "Login daily for 7 days",
    value: 7,
    points: 100,
  },
  {
    title: "Fortnightly Login Streak",
    description: "Login daily for 14 days",
    value: 14,
    points: 200,
  },
  {
    title: "Monthly Login Streak",
    description: "Login daily for 30 days",
    value: 30,
    points: 500,
  },
  {
    title: "Quarterly Login Streak",
    description: "Login daily for 90 days",
    value: 90,
    points: 1000,
  },
  {
    title: "Biannual Login Streak",
    description: "Login daily for 180 days",
    value: 180,
    points: 2000,
  },
  {
    title: "Annual Login Streak",
    description: "Login daily for 365 days",
    value: 365,
    points: 5000,
  },
];

export { getUser, questionTypes, surveyAchievements, loginStreakAchievements };
