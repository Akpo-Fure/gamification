import request from "supertest";
import * as argon from "argon2";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User, Survey } from "../../models";
import { questionTypes } from "../../constants";
import { IQuestion, ISurvey } from "../../interfaces";
import { JWTService } from "../../services";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Get Achievements", () => {
  let token: string;
  let user: any;
  let adminUser: any;
  let survey: any;
  const surveyDto = {
    title: "Survey",
    description: "Survey description",
    startDate: new Date(Date.now()).toDateString(),
    questions: [
      {
        type: questionTypes.MULTIPLE_CHOICE,
        question: "Question 1",
        options: ["Option 1", "Option 2", "Option 3"],
        isRequired: true,
      },
      {
        type: questionTypes.SINGLE_CHOICE,
        question: "Question 2",
        options: ["Option 1", "Option 2", "Option 3"],
        isRequired: true,
      },
    ],
    reward: 100,
    expectedTime: 30,
    isClosed: false,
    participants: [],
  };
  const answerSurveyDto = {
    ...surveyDto,
    answers: [
      ...surveyDto.questions.map((question: IQuestion) => {
        return {
          ...question,
          answer:
            question.type === questionTypes.MULTIPLE_CHOICE
              ? question.options && question.options.length > 0
                ? [question.options[0]]
                : []
              : question.options && question.options.length > 0
              ? question.options[0]
              : undefined,
        };
      }),
    ],
  };

  beforeAll(async () => {
    user = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral2",
    });

    await user.save();

    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+test@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      referrer: user._id,
      verificationToken: JWTService.sign({ referralCode: "someCode" }),
      verificationTokenExpires: new Date(Date.now() + 3600000),
      isAdmin: true,
    });

    await adminUser.save();

    survey = new Survey({
      ...surveyDto,
      createdBy: adminUser._id,
    });
    await survey.save();
  });

  it("should verify email", async () => {
    //Gets one achievement from referring a user  when admin is verified
    const res = await request(app).patch(
      `/api/auth/verifyemail/${adminUser._id}/${adminUser.verificationToken}`
    );
    expect(res.status).toBe(200);
  });

  it("should login ", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should answer survey", async () => {
    //Get one achievement from answer survey
    const res = await request(app)
      .patch(`/api/survey/answer/${survey._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...answerSurveyDto,
        createdBy: adminUser._id,
      });
    expect(res.status).toBe(200);
  });

  it("should get achievements", async () => {
    const res = await request(app)
      .get("/api/achievement")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.achievements.length).toBe(2);
  });
});
