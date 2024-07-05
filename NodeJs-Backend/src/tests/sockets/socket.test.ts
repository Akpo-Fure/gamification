import { connectDB, disconnectDB } from "../../utils/test";
import { createServer } from "node:http";
import { type Socket as ClientSocket, connect } from "socket.io-client";
import { Server } from "socket.io";
import app from "../../app";
import { User } from "../../models";
import { io } from "../../socket/socket";
import { config } from "dotenv";

config();

let socket: ClientSocket;
let httpServer: ReturnType<typeof createServer>;
let ioServer: Server;

beforeAll(async () => {
  await connectDB();
  httpServer = createServer(app);
  httpServer.listen(Number(process.env.PORT));
  ioServer = io;
  ioServer.attach(httpServer);
  socket = connect(process.env.API_URL!, {
    transports: ["websocket"],
  });

  await new Promise<void>((resolve) => socket.on("connect", () => resolve()));
});

afterAll(async () => {
  await disconnectDB();
  ioServer.close();
  httpServer.close();

  if (socket.connected) {
    socket.disconnect();
  }
});

describe("Should connect to socket server", () => {
  let user: any;
  beforeAll(async () => {
    user = new User({
      email: "okegbeakpofurekelvin@gmail.com",
      name: "Okegbe Akpofure Kelvin",
      password: "password",
      referralCode: "referral",
    });

    await user.save();
  });

  it("should go online", async () => {
    socket.emit("go-online", user._id);
    socket.on("go-online", async (userId) => {
      expect(userId).toBe(user?._id!.toString());
      const foundUser = await User.findById(userId);
      expect(foundUser?.online).toBe(true);
    });
  }, 10000);
});
