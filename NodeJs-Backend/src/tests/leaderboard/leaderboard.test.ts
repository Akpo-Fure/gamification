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

describe("Leaderboard", () => {
  let token: string;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeAll(async () => {
    const userDto = {
      password: await argon.hash("password"),
      referralCode: "referral",
    };

    user1 = new User({
      ...userDto,
      email: "okegbeakpofurekelvin1@gmail.com",
      name: "Okegbe Akpofure Kelvin1",
      points: 100,
    });

    user2 = new User({
      ...userDto,
      email: "okegbeakpofurekelvin2@gmail.com",
      name: "Okegbe Akpofure Kelvin2",
      points: 400,
    });

    user3 = new User({
      ...userDto,
      email: "okegbeakpofurekelvin2@gmail.com",
      name: "Okegbe Akpofure Kelvin3",
      points: 300,
    });

    await user1.save();
    await user2.save();
    await user3.save();
  });

  it("should login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user1.email,
      password: "password",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should get leaderboard", async () => {
    const res = await request(app)
      .get("/api/leaderboard")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toHaveLength(3);
    expect(res.body.leaderboard[0].name).toBe(user2.name);
    expect(res.body.leaderboard[1].name).toBe(user3.name);
    expect(res.body.leaderboard[2].name).toBe(user1.name);
    expect(res.body.leaderboard[0].points).toBe(400);
    expect(res.body.leaderboard[1].points).toBe(300);
    expect(res.body.leaderboard[2].points).toBe(100);
  });

  it("should throw error if user is not logged in", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(401);
  });
});
