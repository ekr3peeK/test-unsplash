import { Request, Response, NextFunction } from "express";
import { ApiException } from './../exceptions/api.exception';

export const errorHandlerMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiException) {
    res.status(err.getStatus() ?? 500).send({
      status: false,
      error: err.message ?? "An unexpected exception has occured"
    });
  } else {
    res.status(500).send({
      status: false,
      error: "An unexpected exception has occured."
    });
  }
}