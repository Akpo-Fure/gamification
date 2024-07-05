import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Server } from "socket.io";

let mongoServer: MongoMemoryServer;
let server: Server;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await mongoose.connection.dropDatabase();
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (server) {
    await server.close();
  }
};

export { connectDB, disconnectDB };
