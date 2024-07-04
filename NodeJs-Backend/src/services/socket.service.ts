import { Socket } from "socket.io";
import { User } from "../models";
import UserService from "./user.service";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
} from "../interfaces";

let usersMap = new Map();

const SocketService = {
  goOnline: async (
    userId: string,
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) => {
    try {
      if (!usersMap.has(socket.id)) {
        usersMap.set(socket.id, { userId, socketId: socket.id });
        const updatedUser = await UserService.updateUser(userId, {
          isOnline: true,
        });
        socket.join(updatedUser?._id!.toString());
        console.log(
          `${updatedUser?._id} is ${
            updatedUser?.isOnline ? "Online" : "Offline"
          }`
        );
        return;
      }
    } catch (error) {
      console.log(error);
    }
  },
  goOffline: async (
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) => {
    try {
      if (usersMap.has(socket.id)) {
        const user = usersMap.get(socket.id);
        usersMap.delete(socket.id);
        const updatedUser = await User.findByIdAndUpdate(
          { _id: user.userId },
          { isOnline: false },
          { new: true }
        );
        socket.leave(updatedUser?._id!.toString());
        console.log(
          `${updatedUser?._id} is ${
            updatedUser?.isOnline ? "Online" : "Offline"
          }`
        );
        return;
      }
    } catch (error) {
      console.log(error);
    }
  },
  removeSocket: (
    socket: Socket<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
    >
  ) => {
    if (usersMap.has(socket.id)) {
      usersMap.delete(socket.id);
    }
  },
};

export default SocketService;
