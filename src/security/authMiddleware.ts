import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import { createApiError } from "../types/commonTypes";

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createApiError("Non authentifié", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    next(createApiError("Token invalide ou expiré", 401));
  }
}
