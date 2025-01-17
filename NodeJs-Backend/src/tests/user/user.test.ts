import request from "supertest";
import app from "../../app";
import * as argon from "argon2";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { LoginUserDto } from "../../dto";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Get User", () => {
  let dto: LoginUserDto;
  let newUser: any;
  let token: string;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "someCode",
      isVerified: true,
    });
    await newUser.save();

    dto = {
      email: newUser.email,
      password: "password",
    };
  });

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(dto)
      .timeout(10000);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  }, 10000);

  it("should get user", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`)
      .timeout(10000);
    expect(res.status).toBe(200);
  }, 10000);

  it("should throw error if user is disabled", async () => {
    newUser.isDisabled = true;
    await newUser.save();
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`)
      .timeout(10000);
    expect(res.status).toBe(401);
  }, 10000);

  it("should throw error if token is invalid", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}invalid`)
      .timeout(10000);
    expect(res.status).toBe(401);
  }, 10000);

  it("should throw error if not logged in", async () => {
    const res = await request(app).get("/api/user/me").timeout(10000);
    expect(res.status).toBe(401);
  }, 10000);
});
