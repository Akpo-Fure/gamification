import { Request, Response } from "express";
import { AchievementService } from "../services";
import { IRequest } from "../interfaces";

const AchievementController = {
  getAchievements: async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    const userId = user.id;
    const achievements = await AchievementService.getAchievements(userId);
    return res.status(200).json({ achievements });
  },
};

export default AchievementController;
