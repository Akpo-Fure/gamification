import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";

const validationMiddleware = <T extends object>(type: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    const errors: ValidationError[] = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors.map((error: ValidationError) =>
        Object.values(error.constraints!)
      );
      return res.status(400).json({ message: errorMessages[0][0] });
    } else {
      req.body = dto;
      next();
    }
  };
};

export default validationMiddleware;
