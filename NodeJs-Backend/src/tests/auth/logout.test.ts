import request from "supertest";
import * as argon from "argon2";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Logout", () => {
  let token: string;
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
    });
    await newUser.save();
  });

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: newUser.email,
        password: "password",
      })
      .timeout(10000);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  }, 10000);
  it("should logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .timeout(10000);

    expect(res.status).toBe(200);
  }, 10000);

  it("should throw error if user is not logged in", async () => {
    const res = await request(app).post("/api/auth/logout").timeout(10000);
    expect(res.status).toBe(401);
  }, 10000);
});
