import { Request, Response, NextFunction } from "express";
import { createApiError } from "../types/commonTypes";

export function validateExamInput(req: Request, _res: Response, next: NextFunction): void {
  const { title, courseId, startDate, endDate } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    next(createApiError("Le champ 'title' est obligatoire", 400));
    return;
  }

  if (!courseId) {
    next(createApiError("Le champ 'courseId' est obligatoire", 400));
    return;
  }

  if (!startDate) {
    next(createApiError("Le champ 'startDate' est obligatoire", 400));
    return;
  }

  if (!endDate) {
    next(createApiError("Le champ 'endDate' est obligatoire", 400));
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    next(createApiError("Le champ 'startDate' doit être une date valide", 400));
    return;
  }

  if (isNaN(end.getTime())) {
    next(createApiError("Le champ 'endDate' doit être une date valide", 400));
    return;
  }

  if (end <= start) {
    next(createApiError("La date de fin doit être postérieure à la date de début", 400));
    return;
  }

  next();
}
