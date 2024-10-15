import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateZodSchemaMiddleware = (schema: ZodType<unknown>) => {
  if (!schema) {
    throw new Error('Schema not provided');
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const validate =  schema.safeParse(body);

    if (validate.success == false) {
      res.send({
        status: false,
        error: {
          message: `Invalod payload: ${validate.error.toString()}`
        }
      });

      return;
    } else {
      return next();
    }
  } 
}