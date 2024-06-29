import { Response } from "express";
import * as argon from "argon2";
import { UserService, JWTService } from "../services";
import {
  SignupUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto";

import { getUser } from "../constants";
import { areConsecutiveDays } from "../utils";

const AuthService = {
  signup: async (res: Response, dto: SignupUserDto) => {
    let user = await UserService.getUser(getUser.EMAIL, dto.email);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const referralCode = await UserService.generateUniqueReference();

    dto.password = await argon.hash(dto.password);

    await UserService.create({
      ...dto,
      referralCode,
    });

    return res
      .status(201)
      .json({ message: "User created verification email sent" });
  },

  login: async (res: Response, dto: LoginUserDto) => {
    const now = new Date(Date.now());
    let user = await UserService.getUser(getUser.EMAIL, dto.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isDisabled) {
      return res.status(400).json({ message: "User is disabled" });
    }

    if (!user.isVerified) {
    }

    if (areConsecutiveDays(user.lastLogin, now)) {
      user.loginStreak += 1;
    } else {
      user.loginStreak = 1;
    }

    user.lastLogin = now;

    const validPassword = await argon.verify(user?.password!, dto.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = JWTService.sign(user.toObject(), { expiresIn: "1d" });

    user = await user.save();

    user.password = "";

    return res.status(200).json({ user, token, message: "Login successful" });
  },

  forgotpassword: async (res: Response, dto: ForgotPasswordDto) => {
    let user = await UserService.getUser(getUser.EMAIL, dto.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = JWTService.sign({ email: dto.email }).split(".")[2];

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    return res.status(200).json({ message: "Token sent to email" });
  },

  resetpassword: async (
    res: Response,
    userId: string,
    token: string,
    dto: ResetPasswordDto
  ) => {
    let user = await UserService.getUser(getUser.OPTIONS, undefined, {
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await argon.hash(dto.password);

    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  },
};

export default AuthService;
