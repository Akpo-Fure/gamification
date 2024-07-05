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

describe("Get Surveys by Admin", () => {
  let adminToken: string;
  let normalToken: string;
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
      startDate: new Date(Date.now() + 100000).toDateString(),
    });

    await actveSurvey.save();
    await inactiveSurvey.save();
  });

  it("should login as admin", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminUser.email,
        password: "password",
      })
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  }, 10000);

  it("should login as normal user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: user.email,
        password: "password",
      })
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    normalToken = res.body.token;
  }, 10000);

  it("should surveys", async () => {
    const res = await request(app)
      .get("/api/admin/surveys")
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(10000);
    expect(res.status).toBe(200);
    expect(res.body.surveys.length).toBe(2);
  }, 10000);

  it("should throw error if user is not admin", async () => {
    const res = await request(app)
      .get("/api/admin/surveys")
      .set("Authorization", `Bearer ${normalToken}`)
      .timeout(10000);
    expect(res.status).toBe(403);
  }, 10000);
});
