import mongoose, { Schema, Document } from "mongoose";

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: false },
    isAdmin: { type: Boolean, required: true, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    referralCode: { type: String, required: true },
    lastLogin: { type: Date, required: false },
    loginStreak: { type: Number, required: true, default: 0 },
    verificationToken: { type: String, required: false },
    verificationTokenExpire: { type: Date, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpire: { type: Date, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
