import { User } from "../models";
import { IUser } from "../interfaces";
import { SignupUserDto } from "../dto";
import { getUser } from "../constants";
import { get } from "mongoose";

const UserService = {
  getUser: async (
    type: string,
    value?: string,
    options?: object
  ): Promise<IUser | null> => {
    switch (type) {
      case getUser.ID:
        return await User.findById(value);
      case getUser.EMAIL:
        return await User.findOne({
          email: value,
        });
      case getUser.OPTIONS:
        return await User.findOne(options);
      default:
        return null;
    }
  },

  create: async (data: SignupUserDto) => {
    return await User.create(data);
  },

  generateUniqueReference: async (): Promise<string | undefined> => {
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

    throw new Error(
      "Unable to generate unique referral code after multiple attempts, please try again later."
    );
  },

  updateUser: async (id: string, data: any) => {
    return await User.findByIdAndUpdate(
      id,
      { ...data },
      {
        new: true,
      }
    );
  },

  getAllUsers: async () => {
    return await User.find();
  },
};

export default UserService;
