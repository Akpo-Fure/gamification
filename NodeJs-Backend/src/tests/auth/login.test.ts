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
  await User.deleteMany({});
  await disconnectDB();
});

describe("Login", () => {
  let dto: LoginUserDto;
  let newUser: any;

  beforeAll(async () => {
    newUser = new User({
      name: "Okegbe Akpofure Kelvin",
      email: "okegbeakpofurekelvin@gmail.com",
      password: await argon.hash("password"),
      referralCode: "someCode",
    });
    await newUser.save();

    dto = {
      email: newUser.email,
      password: "password",
    };
  });

  it("should login", async () => {
    const res = await request(app).post("/api/auth/login").send(dto);
    expect(res.status).toBe(200);
  });

  it("should throw error if user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testgmail.com", password: "password" });
    expect(res.status).toBe(400);
  });

  it("should throw error if password is incorrect", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ ...dto, password: "wrongpassword" });
    expect(res.status).toBe(400);
  });

  it("should throw error if user is disabled", async () => {
    await User.findByIdAndUpdate(newUser._id, { isDisabled: true });
    const res = await request(app).post("/api/auth/login").send(dto);
    expect(res.status).toBe(400);
  });
});
