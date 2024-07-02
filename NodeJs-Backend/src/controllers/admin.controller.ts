import { Request, Response } from "express";
import { catchAsync } from "../middlewares";
import { AdminService } from "../services";

const AdminController = {
  getAllUsers: catchAsync(async (req: Request, res: Response) => {
    return await AdminService.getAllUsers(res);
  }),
};

export default AdminController;
