import { Request, Response } from "express";
import { catchAsync } from "../middlewares";
import { AdminService, SurveyService } from "../services";

const AdminController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();
    return res.status(200).json(users);
  }),
  getAllSurveys: catchAsync(async (req: Request, res: Response) => {
    const surveys = await SurveyService.getAllSurveys();
    return res.status(200).json({ surveys });
  }),
};

export default AdminController;
