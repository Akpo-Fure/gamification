import request from "supertest";
import * as argon from "argon2";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User, Survey } from "../../models";
import { questionTypes } from "../../constants";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Get Active Surveys", () => {
  let token: string;
  let user: any;
  let adminUser: any;
  let actveSurvey: any;
  let inactiveSurvey: any;

  beforeAll(async () => {
    user = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
    });
    await user.save();

    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+test@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      isAdmin: true,
    });

    await adminUser.save();

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
      createdBy: adminUser._id,
      reward: 100,
      expectedTime: 30,
    };

    actveSurvey = new Survey(dto);

    inactiveSurvey = new Survey({
      ...dto,
      title: "Inactive Survey",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString(),
    });

    await actveSurvey.save();
    await inactiveSurvey.save();
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

  it("should get active surveys", async () => {
    const res = await request(app)
      .get("/api/survey/active")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.surveys.length).toBe(1);
  });

  it("should throw error if user is not logged in", async () => {
    const res = await request(app).get("/api/survey/active");
    expect(res.status).toBe(401);
  });
});
