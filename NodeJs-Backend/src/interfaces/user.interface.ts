import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  isAdmin: boolean;
  isVerified: boolean;
  referralCode: string;
  lastLogin?: Date;
  loginStreak: number;
  isDisabled: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
