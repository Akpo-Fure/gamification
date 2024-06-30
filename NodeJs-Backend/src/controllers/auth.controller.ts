import { Request, Response } from "express";
import { AuthService } from "../services";
import { catchAsync } from "../middlewares";

const AuthController = {
  signup: catchAsync(async (req: Request, res: Response) => {
    return await AuthService.signup(res, req.body);
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    return await AuthService.login(res, req.body);
  }),

  forgotpassword: catchAsync(async (req: Request, res: Response) => {
    return await AuthService.forgotpassword(res, req.body);
  }),

  resetpassword: catchAsync(async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    return await AuthService.resetpassword(res, userId, token, req.body);
  }),

  logout: catchAsync(async (req: Request, res: Response) => {
    return await AuthService.logout(res);
  }),
};

export default AuthController;
