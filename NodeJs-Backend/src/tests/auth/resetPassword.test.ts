import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { JWTService } from "../../services";
import { ResetPasswordDto } from "../../dto";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await User.deleteMany({});
  await disconnectDB();
});

describe("Reset Password", () => {
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: "password",
      referralCode: "referral",
      resetPasswordToken: JWTService.sign({ referrer: "referrer" }).split(
        "."
      )[2],
      resetPasswordExpires: new Date(Date.now() + 3600000),
    });
    await newUser.save();
  });

  it("should reset password", async () => {
    const dto: ResetPasswordDto = {
      password: "newPassword",
      confirmPassword: "newPassword",
    };
    const res = await request(app)
      .patch(
        `/api/auth/resetpassword/${newUser.id}/${newUser.resetPasswordToken}`
      )
      .send(dto);
    expect(res.status).toBe(200);
  });

  it("should throw error if token expires", async () => {
    newUser.resetPasswordExpires = new Date(Date.now() - 3600000);
    await newUser.save();

    const dto: ResetPasswordDto = {
      password: "newPassword",
      confirmPassword: "newPassword",
    };
    const res = await request(app)
      .patch(
        `/api/auth/resetpassword/${newUser.id}/${newUser.resetPasswordToken}`
      )
      .send(dto);
    expect(res.status).toBe(400);
  });
});
