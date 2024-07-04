import { Request, Response } from "express";
import { LeaderboardService } from "../services";

const LeaderboardController = {
  getLeaderboard: async (req: Request, res: Response) => {
    const leaderboard = await LeaderboardService.getLeaderboard();
    return res.status(200).json({ leaderboard });
  },
};

export default LeaderboardController;
