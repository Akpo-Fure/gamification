import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  isAdmin: boolean;
  isOnline: boolean;
  isVerified: boolean;
  referralCode: string;
  lastLogin?: Date;
  loginStreak: number;
  surveysAnswered: number;
  personsReferred: number;
  referrer?: string;
  points: number;
  isDisabled: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
