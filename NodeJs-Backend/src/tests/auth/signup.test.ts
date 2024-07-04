import request from "supertest";
import app from "../../app";
import { connectDB, disconnectDB } from "../../utils/test";
import { User } from "../../models";
import { SignupUserDto } from "../../dto";
import { JWTService } from "../../services";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Server } from "socket.io";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Signup", () => {
  const dto: SignupUserDto = {
    name: "Okegbe Akpofure Kelvin",
    email: "okegbeakpofurekelvin@gmail.com",
    password: "password",
    confirmPassword: "password",
  };

  it("should sign up", async () => {
    const res = await request(app).post("/api/auth/signup").send(dto);
    expect(res.status).toBe(201);
  });
  it("should throw error if user already exists", async () => {
    await request(app).post("/api/auth/signup").send(dto);
    const res = await request(app).post("/api/auth/signup").send(dto);
    expect(res.status).toBe(400);
  });
  it("should throw error if password and confirmPassword do not match", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...dto, confirmPassword: "wrongpassword" });
    expect(res.status).toBe(400);
  });
});
