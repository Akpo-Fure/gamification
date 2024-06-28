interface IUserResponse {
  _id: string;
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
  verificationTokenExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { IUserResponse };
