import { Response, NextFunction, Request } from "express";
import catchAsync from "./catchAsync.middleware";
import { IRequest } from "../interfaces";

const AdminMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as IRequest).user;
    if (user.isAdmin === true) {
      next();
    } else {
      return res
        .status(401)
        .json({
          message: "Unauthorized, Only Admins can access this endpoint",
        });
    }
  }
);

export default AdminMiddleware;
