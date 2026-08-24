import { Request, Response, NextFunction } from "express";
import { createApiError } from "../types/commonTypes";

export function validateCourseCreate(req: Request, _res: Response, next: NextFunction): void {
  const { code, name } = req.body;

  if (!code || typeof code !== "string" || code.trim() === "") {
    next(createApiError("Le champ 'code' est obligatoire", 400));
    return;
  }

  if (code.length > 20) {
    next(createApiError("Le champ 'code' ne doit pas dépasser 20 caractères", 400));
    return;
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    next(createApiError("Le champ 'name' est obligatoire", 400));
    return;
  }

  next();
}
