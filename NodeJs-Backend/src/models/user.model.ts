import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces";

const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
    isOnline: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    referralCode: { type: String, required: true },
    lastLogin: { type: Date, required: false },
    loginStreak: { type: Number, required: true, default: 0 },
    surveysAnswered: { type: Number, required: true, default: 0 },
    isDisabled: { type: Boolean, required: true, default: false },
    verificationToken: { type: String, required: false },
    verificationTokenExpires: { type: Date, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
