import http from "http";
import { Application } from "express";
import { Server } from "socket.io";

const socketServer = (app: Application): http.Server => {
  const URL = process.env.CLIENT_URL;
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    app.set("socket", socket);
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  app.set("io", io);
  return server;
};

export default socketServer;
