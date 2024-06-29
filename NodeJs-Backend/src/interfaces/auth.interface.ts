import { Request } from "express";
import { IUserResponse } from ".";

interface IRequest extends Request {
  user: IUserResponse;
}

export { IRequest };
