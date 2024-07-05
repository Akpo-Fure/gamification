import UserService from "./user.service";

const AdminService = {
  getAllUsers: async () => {
    const users = await UserService.getAllUsers();
    return users;
  },
};

export default AdminService;
