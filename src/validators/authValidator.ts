import { Request, Response, NextFunction } from "express";
import { requireFields } from "../middlewares/validationMiddleware";
import { createApiError } from "../types/commonTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body.email && !EMAIL_REGEX.test(req.body.email)) {
    next(createApiError("Le format de l'email est invalide", 400));
    return;
  }
  next();
};

export const validateLogin = [validateEmailFormat, ...requireFields("email", "password")];
