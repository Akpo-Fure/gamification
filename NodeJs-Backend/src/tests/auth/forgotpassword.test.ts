import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { ForgotPasswordDto } from "../../dto";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await User.deleteMany({});
  await disconnectDB();
});

describe("Forgot Password", () => {
  let dto: ForgotPasswordDto;
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: "password",
      referralCode: "referral",
    });
    await newUser.save();

    dto = {
      email: newUser.email,
    };
  });
  it("should send reset password email", async () => {
    const res = await request(app).patch("/api/auth/forgotpassword").send(dto);
    expect(res.status).toBe(200);
  });

  it("should throw error if user does not exist", async () => {
    const res = await request(app)
      .patch("/api/auth/forgotpassword")
      .send({ email: "test@gmail.com" });
    expect(res.status).toBe(400);
  });
});
