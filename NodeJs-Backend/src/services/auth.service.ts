import { Response } from "express";
import * as argon from "argon2";
import { UserService, JWTService } from "../services";
import { CreateUserDto, LoginUserDto } from "../dto";
import { getUser } from "../constants";
import { areConsecutiveDays } from "../utils";

const AuthService = {
  signup: async (res: Response, dto: CreateUserDto) => {
    let user = await UserService.getUser(dto.email, getUser.EMAIL);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const referralCode = await UserService.generateUniqueReference();

    if (!referralCode) {
      return res.status(400).json({
        message:
          "Unable to generate unique referral code after multiple attempts, please try again later.",
      });
    }

    dto.password = await argon.hash(dto.password);

    dto.referralCode = referralCode;

    await UserService.create(dto);

    return res.status(201).json({ user });
  },

  login: async (res: Response, dto: LoginUserDto) => {
    const now = new Date(Date.now());
    let user = await UserService.getUser(dto.email, getUser.EMAIL);

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
};

export default AuthService;
