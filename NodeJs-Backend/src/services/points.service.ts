import { Socket } from "socket.io";
import { Request } from "express";
import { User } from "../models";

const PointsService = {
  updateUserPoints: async (req: Request, userId: string, points: number) => {
    const IO = req.app.get("IO") as Socket;

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },

      {
        new: true,
      }
    );

    IO.to(userId).emit("received_points", points);
    IO.to(userId).emit("total_points", user?.points);
  },

  emitLeaderboard: async (req: Request) => {
    const IO = req.app.get("IO") as Socket;

    const users = await User.find({ isDisabled: false, isAdmin: false })
      .sort({ points: -1 })
      .select({ name: 1, points: 1, _id: 0 });

    IO.emit("new_leaderboard", users);
  },
};

export default PointsService;
