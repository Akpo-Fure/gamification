import request from "supertest";
import * as argon from "argon2";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User, Survey } from "../../models";
import { questionTypes } from "../../constants";
import { IQuestion, ISurvey } from "../../interfaces";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Answer Survey", () => {
  let token: string;
  let user: any;
  let adminUser: any;
  let survey: any;

  const dto = {
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
  };
  const answerSurveyDto = {
    ...dto,
    answers: [
      ...dto.questions.map((question: IQuestion) => {
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
      referralCode: "referral",
      isVerified: true,
    });
    await user.save();

    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+test@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      isAdmin: true,
      isVerified: true,
    });

    await adminUser.save();

    survey = new Survey({
      ...dto,
      createdBy: adminUser._id,
    });
    await survey.save();
  });

  it("should login ", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "password",
      })
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  }, 10000);

  it("should answer survey", async () => {
    const res = await request(app)
      .patch(`/api/survey/answer/${survey._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...answerSurveyDto,
        createdBy: adminUser._id,
      })
      .timeout(10000);
    const activeUser = await User.findById(user._id);
    expect(res.status).toBe(200);
    expect(activeUser?.points).toBe(150); // 50 points for an achievement (answering their first survey)
    expect(activeUser?.surveysAnswered).toBe(1);
  }, 10000);

  it("should throw error if user has already answered survey", async () => {
    const res = await request(app)
      .patch(`/api/survey/answer/${survey._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...answerSurveyDto,
        createdBy: adminUser._id,
      })
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);

  it("should throw error if not logged in", async () => {
    const res = await request(app)
      .patch(`/api/survey/answer/${survey._id}`)
      .send({
        ...answerSurveyDto,
        createdBy: adminUser._id,
      })
      .timeout(10000);
    expect(res.status).toBe(401);
  }, 10000);
});
