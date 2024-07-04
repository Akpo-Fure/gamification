import { User } from "../models";

const LeaderboardService = {
  getLeaderboard: async () => {
    return await User.find({ isDisabled: false })
      .sort({ points: -1 })
      .select({ name: 1, points: 1, _id: 0 });
  },
};

export default LeaderboardService;
