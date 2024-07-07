import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../../config";

describe("Database Connection", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should connect to the database", async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it("shoul process.exit(1) if there is an error connecting to the database", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation();
    jest
      .spyOn(mongoose, "connect")
      .mockRejectedValue(new Error("Database Error"));

    try {
      await connectDB();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(mockExit).toHaveBeenCalledWith(1);
    }
  });
});
