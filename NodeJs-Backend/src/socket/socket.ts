import http from "http";
import { Application } from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
import { SocketService } from "../services";

config();

const socketServer = (app: Application): http.Server => {
  const URL = process.env.CLIENT_URL;
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("go-online", async (userId) => {
      await SocketService.goOnline(userId, socket);
    });

    socket.on("disconnect", async () => {
      await SocketService.goOffline(socket);
      SocketService.removeSocket(socket);
      socket.disconnect();
    });
  });

  app.set("IO", io);
  return server;
};

export default socketServer;
