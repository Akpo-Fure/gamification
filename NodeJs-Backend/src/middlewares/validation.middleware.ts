import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import catchAsync from "./catchAsync.middleware";

const validationMiddleware = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = `${error.errors[0].path.join(".")} ${
          error.errors[0].message
        }`
          .toLowerCase()
          .trim();
        return res.status(400).json({ message });
      }
      next(error);
    }
  });
};

export default validationMiddleware;
