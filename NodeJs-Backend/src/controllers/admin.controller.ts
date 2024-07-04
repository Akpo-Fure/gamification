import { Request, Response } from "express";
import { catchAsync } from "../middlewares";
import { AdminService, SurveyService } from "../services";

const AdminController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    return await AdminService.getAllUsers(res);
  }),
  getAllSurveys: catchAsync(async (req: Request, res: Response) => {
    return await SurveyService.getAllSurveys(res);
  }),
};

export default AdminController;
