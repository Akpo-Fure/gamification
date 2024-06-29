import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsUrl()
  @IsOptional()
  profilePhoto?: string;

  @IsOptional()
  isAdmin?: boolean;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  referralCode?: string;

  @IsOptional()
  lastLogin?: Date;

  @IsOptional()
  loginStreak?: number;

  @IsOptional()
  verificationToken?: string;

  @IsOptional()
  @IsBoolean()
  isDisabled?: boolean;

  @IsOptional()
  verificationTokenExpires?: Date;

  @IsOptional()
  resetPasswordToken?: string;

  @IsOptional()
  resetPasswordExpires?: Date;
}

export { CreateUserDto };
