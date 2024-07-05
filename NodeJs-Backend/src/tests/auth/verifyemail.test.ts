import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { SignupUserDto } from "../../dto";
import { JWTService } from "../../services";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Verify Email", () => {
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: "password",
      verificationToken: JWTService.sign({ referralCode: "someCode" }),
      verificationTokenExpires: new Date(Date.now() + 3600000),
      referralCode: "someCode",
    });

    await newUser.save();
  });

  it("should verify email", async () => {
    const res = await request(app)
      .patch(
        `/api/auth/verifyemail/${newUser._id}/${newUser.verificationToken}`
      )
      .timeout(10000);
    expect(res.status).toBe(200);
  }, 10000);

  it("should throw error if token expires", async () => {
    await User.findByIdAndUpdate(newUser._id, {
      verificationTokenExpires: new Date(Date.now() - 3600000),
    });

    const res = await request(app)
      .patch(
        `/api/auth/verifyemail/${newUser._id}/${newUser.verificationToken}`
      )
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);

  it("should throw error if user is already verified", async () => {
    await User.findByIdAndUpdate(newUser._id, { isVerified: true });

    const res = await request(app)
      .patch(
        `/api/auth/verifyemail/${newUser?._id}/${newUser.verificationToken}`
      )
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);
});
