import request from "supertest";
import * as argon from "argon2";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User, Survey } from "../../models";
import { SignupUserDto, CreateSurveyDto } from "../../dto";
import { questionTypes } from "../../constants";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Create Survey", () => {
  let adminToken: string;
  let normalToken: string;
  let adminUser: any;
  let normalUser: any;

  beforeAll(async () => {
    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      isAdmin: true,
    });
    normalUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+1@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
    });

    await adminUser.save();
    await normalUser.save();
  });

  const dto: CreateSurveyDto = {
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
    expectedTime: 30,
    reward: 100,
  };

  it("should login as admin", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it("should login as normal user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: normalUser.email,
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    normalToken = res.body.token;
  });

  it("should create survey", async () => {
    const res = await request(app)
      .post("/api/survey/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(dto);

    expect(res.status).toBe(201);
  });

  it("should throw error if user is not admin", async () => {
    const res = await request(app)
      .post("/api/survey/create")
      .set("Authorization", `Bearer ${normalToken}`)
      .send(dto);

    expect(res.status).toBe(403);
  });
});
