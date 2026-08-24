import { Request, Response, NextFunction } from "express";
import { createApiError } from "../types/commonTypes";

export function validateStudentCreate(req: Request, _res: Response, next: NextFunction): void {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    next(createApiError("Le champ 'firstName' est obligatoire", 400));
    return;
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
    next(createApiError("Le champ 'lastName' est obligatoire", 400));
    return;
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    next(createApiError("Le champ 'email' est obligatoire", 400));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    next(createApiError("Le champ 'email' doit être une adresse valide", 400));
    return;
  }

  if (!password || typeof password !== "string") {
    next(createApiError("Le champ 'password' est obligatoire", 400));
    return;
  }

  if (password.length < 8) {
    next(createApiError("Le champ 'password' doit contenir au moins 8 caractères", 400));
    return;
  }

  next();
}

export function validateStudentUpdate(req: Request, _res: Response, next: NextFunction): void {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    next(createApiError("Le champ 'firstName' est obligatoire", 400));
    return;
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
    next(createApiError("Le champ 'lastName' est obligatoire", 400));
    return;
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    next(createApiError("Le champ 'email' est obligatoire", 400));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    next(createApiError("Le champ 'email' doit être une adresse valide", 400));
    return;
  }

  if (password !== undefined && password !== null) {
    if (typeof password !== "string") {
      next(createApiError("Le champ 'password' doit être une chaîne de caractères", 400));
      return;
    }

    if (password.length < 8) {
      next(createApiError("Le champ 'password' doit contenir au moins 8 caractères", 400));
      return;
    }
  }

  next();
}
