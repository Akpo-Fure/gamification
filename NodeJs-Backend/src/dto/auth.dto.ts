import { IsEmail, IsString, IsNotEmpty } from "class-validator";

class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export { LoginUserDto };
