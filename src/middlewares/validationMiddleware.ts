import { Request, Response, NextFunction } from "express";
import { createApiError } from "../types/commonTypes";

export function requireFields(...fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === "") {
        next(createApiError(`Le champ '${field}' est obligatoire`, 400));
        return;
      }
    }
    next();
  };
}
