import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { ResendEmailVerificationDto } from "../../dto";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Resend Email Verification", () => {
  let dto: ResendEmailVerificationDto;
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: "password",
      referralCode: "someCode",
    });
    await newUser.save();

    dto = {
      email: newUser.email,
    };
  });

  it("should resend email verification", async () => {
    const res = await request(app)
      .patch("/api/auth/resendemailverification")
      .send(dto)
      .timeout(10000);
    expect(res.status).toBe(200);
  }, 10000);

  it("should throw error if user does not exist", async () => {
    const res = await request(app)
      .patch("/api/auth/resendemailverification")
      .send({ email: "test@gmail.com" })
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);

  it("should throw error if user is already verified", async () => {
    newUser.isVerified = true;
    await newUser.save();

    const res = await request(app)
      .patch("/api/auth/resendemailverification")
      .send(dto)
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);
});
