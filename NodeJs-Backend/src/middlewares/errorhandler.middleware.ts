import { NextFunction, Request, Response } from "express";
import { IError } from "../interfaces";

const errorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  if (process.env.NODE_ENV === "production") {
    return res.status(err.status || 500).json({
      message:
        err.message || "An unexpected error occurred. Please try again later.",
      error: {},
    });
  } else {
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      error: err.stack,
    });
  }
};

export default errorHandler;
