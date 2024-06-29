import { Response, NextFunction } from "express";
import { UserService, JWTService } from "../services";
import { getUser } from "../constants";
import { IUser, IRequest } from "../interfaces";

const AuthMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized! Please log in" });
  }

  try {
    const decoded = JWTService.verify(token) as IUser;

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserService.getUser(getUser.ID, decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isDisabled) {
      return res
        .status(401)
        .json({ message: "Your account is disabled, please contact support" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized " });
  }
};

export default AuthMiddleware;
