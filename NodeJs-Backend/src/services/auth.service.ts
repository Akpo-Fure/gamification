import { Response } from "express";
import * as argon from "argon2";
import { UserService, JWTService, EmailService } from "../services";
import {
  SignupUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto";

import { getUser } from "../constants";
import { areConsecutiveDays } from "../utils";
import { IUser } from "../interfaces";

const AuthService = {
  signup: async (res: Response, dto: SignupUserDto) => {
    let user = await UserService.getUser(getUser.EMAIL, dto.email);

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const referralCode = await UserService.generateUniqueReference();

    dto.password = await argon.hash(dto.password);

    const token = JWTService.sign({ referralCode }).split(".")[2];

    const newUser = await UserService.create({
      ...dto,
      referralCode,
      verificationToken: token,
      verificationTokenExpires: new Date(Date.now() + 3600000),
    });

    await sendEmailVerification(newUser);

    return res
      .status(201)
      .json({ message: "User created verification email sent" });
  },

  resendEmailVerification: async (res: Response, email: string) => {
    let user = await UserService.getUser(getUser.EMAIL, email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const isEmailSent = await sendEmailVerification(user);

    if (!isEmailSent) {
      return res
        .status(400)
        .json({ message: "Error sending verification email" });
    }

    return res.status(200).json({ message: "Verification email sent" });
  },

  verifyEmail: async (res: Response, email: string, token: string) => {
    let user = await UserService.getUser(getUser.OPTIONS, undefined, {
      email,
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date(Date.now()) },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;

    await user.save();

    return res.status(200).json({ message: "Email verified" });
  },

  login: async (res: Response, dto: LoginUserDto) => {
    const now = new Date(Date.now());
    let user = await UserService.getUser(getUser.EMAIL, dto.email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isDisabled) {
      return res
        .status(400)
        .json({ message: "User is disabled, contact support" });
    }

    if (!user.isVerified) {
      await sendEmailVerification(user);
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

    user = await user.save();

    const link = `${process.env.CLIENT_URL}/auth/resetpassword/${user.id}/${token}`;

    const isEmailSent = await EmailService.sendEmail(
      user.email,
      "Password Reset",
      `<p>Click <a href="${link}">here</a> to reset your password<br/> email is valid for 1 hour<br/> Ignore this email if you did not initiate this request</p>`
    );

    if (!isEmailSent) {
      return res
        .status(400)
        .json({ message: "Error sending password reset email" });
    }

    return res
      .status(200)
      .json({ message: "Check your email to reset your password" });
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

  logout: async (res: Response) => {
    return res.status(200).json({ message: "Logout successful" });
  },
};

const sendEmailVerification = async (user: any) => {
  const token = JWTService.sign({ referralCode: user.referralCode }).split(
    "."
  )[2];

  user.verificationToken = token;
  user.verificationTokenExpires = new Date(Date.now() + 3600000);

  await user.save();

  const link = `${process.env.CLIENT_URL}/auth/login?user=${user.email}&token=${token}`;

  const isEmailSent = await EmailService.sendEmail(
    user.email,
    "Email Verification",
    `<p>Click <a href="${link}">here</a> to verify your email<br/> email is valid for 1 hour<br/> Ignore this email if you did not initiate this request</p>`
  );

  return isEmailSent;
};

export default AuthService;
