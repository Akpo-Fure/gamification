import { Response, NextFunction, Request } from "express";
import { UserService, JWTService } from "../services";
import { getUser } from "../constants";
import { IUser, IRequest } from "../interfaces";
import { areConsecutiveDays } from "../utils";
import catchAsync from "./catchAsync.middleware";

const AuthMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Please log in" });
    }

    try {
      const decoded = JWTService.verify(token) as IUser;

      if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await UserService.getUser(getUser.ID, decoded._id as string);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (
        user.lastLogin &&
        user.lastLogin.toISOString().slice(0, 10) !==
          new Date().toISOString().slice(0, 10)
      ) {
        if (areConsecutiveDays(user.lastLogin, new Date())) {
          user.loginStreak += 1;
        } else {
          user.loginStreak = 1;
        }

        user.lastLogin = new Date();

        await user.save();
      }

      if (user.isDisabled) {
        return res.status(401).json({
          message: "Your account is disabled, please contact support",
        });
      }
      user.password = "";

      (req as IRequest).user = user;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
);

export default AuthMiddleware;
