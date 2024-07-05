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

describe("Get Surveys by Admin", () => {
  let adminToken: string;
  let normalToken: string;
  let user: any;
  let adminUser: any;

  beforeAll(async () => {
    user = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      isVerified: true,
    });

    adminUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin+test@gmail.com",
      password: await argon.hash("password"),
      referralCode: "referral",
      isAdmin: true,
      isVerified: true,
    });

    await user.save();
    await adminUser.save();
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

  it("should get users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .timeout(10000);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  }, 10000);

  it("should throw error if user is not admin", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${normalToken}`)
      .timeout(10000);
    expect(res.status).toBe(403);
  }, 10000);
});
