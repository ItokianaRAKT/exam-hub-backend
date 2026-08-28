import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";
import { createApiError } from "../types/commonTypes";
import { findById } from "../repositories/userRepository";

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(createApiError("Non authentifié", 401));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);

    const user = await findById(payload.userId);
    if (!user || !user.isActive) {
      next(createApiError("Compte désactivé ou introuvable", 401));
      return;
    }

    req.user = payload;
    next();
  } catch {
    next(createApiError("Token invalide ou expiré", 401));
  }
};
