import { Request } from "express";
import { Achievement } from "../models";

const AchievementService = {
  createAchievement: async (
    req: Request,
    userId: string,
    name: string,
    description: string
  ) => {
    const IO = req.app.get("IO");

    const achievement = await Achievement.create({
      name,
      description,
      userId,
    });

    IO.to(userId).emit("new_achievement", achievement);
  },

  getAchievements: async (userId: string) => {
    return await Achievement.find({ userId }).sort({ createdAt: -1 });
  },
};

export default AchievementService;
