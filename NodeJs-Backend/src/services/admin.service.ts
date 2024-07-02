import { Response } from "express";
import UserService from "./user.service";

const AdminService = {
  getAllUsers: async (res: Response) => {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  },
};

export default AdminService;
