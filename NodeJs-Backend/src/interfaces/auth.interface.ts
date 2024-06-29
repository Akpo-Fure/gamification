import { Request } from "express";
import { IUser } from ".";

interface IRequest extends Request {
  user: IUser;
}

export { IRequest };
