import { User } from "../models";
import { IUserResponse } from "../interfaces";
import { CreateUserDto } from "../dto";
import { getUser } from "../constants";

const UserService = {
  getUser: async (value: string, type: string): Promise<any> => {
    switch (type) {
      case getUser.ID:
        return await User.findById(value);
      case getUser.EMAIL:
        return await User.findOne({
          email: value,
        });
      default:
        return null;
    }
  },

  create: async (data: CreateUserDto) => {
    return await User.create(data);
  },

  generateUniqueReference: async (): Promise<string | null> => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referralCode = "";

    for (let attempt = 0; attempt < 10; attempt++) {
      referralCode = "";
      for (let i = 0; i < 6; i++) {
        referralCode += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }

      const user = await User.findOne({ referralCode });

      if (!user) {
        return referralCode;
      }
    }

    return null;
  },
};

export default UserService;
