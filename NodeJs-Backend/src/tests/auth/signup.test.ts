import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { SignupUserDto } from "../../dto";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Signup", () => {
  const dto: SignupUserDto = {
    name: "Okegbe Akpofure Kelvin",
    email: "okegbeakpofurekelvin@gmail.com",
    password: "password",
    confirmPassword: "password",
  };

  it("should sign up", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send(dto)
      .timeout(10000);
    expect(res.status).toBe(201);
  }, 10000);
  it("should throw error if user already exists", async () => {
    await request(app).post("/api/auth/signup").send(dto);
    const res = await request(app)
      .post("/api/auth/signup")
      .send(dto)
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);
  it("should throw error if password and confirmPassword do not match", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...dto, confirmPassword: "wrongpassword" })
      .timeout(10000);
    expect(res.status).toBe(400);
  }, 10000);
});
