import { Request, Response } from "express";
import { IRequest } from "../interfaces";
import { UserService } from "../services";
import { catchAsync } from "../middlewares";
import { getUser } from "../constants";

const UserController = {
  getUser: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as IRequest;
    return res.status(200).json({ user });
  }),
};

export default UserController;
