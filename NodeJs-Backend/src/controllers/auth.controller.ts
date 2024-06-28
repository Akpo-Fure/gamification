import { Request, Response } from "express";
import { AuthService } from "../services";

const AuthController = {
  signup: async (req: Request, res: Response) => {
    return await AuthService.signup(res, req.body);
  },
  login: async (req: Request, res: Response) => {
    return await AuthService.login(res, req.body);
  },
};

export default AuthController;
