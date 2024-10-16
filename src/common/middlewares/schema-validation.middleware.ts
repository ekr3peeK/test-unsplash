import { BadRequestException } from "../exceptions/bad-request.exception";

import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateZodSchemaMiddleware = (schema: ZodType<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const validate =  schema.safeParse(body);

    if (validate.success === false) {
      throw new BadRequestException(`Invalid payload received: ${validate.error.toString()}`);
    } else {
      next();
    }
  } 
}