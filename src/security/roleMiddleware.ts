import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/authTypes";
import { createApiError } from "../types/commonTypes";

export function roleMiddleware(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createApiError("Non authentifié", 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createApiError("Accès refusé", 403));
      return;
    }

    next();
  };
}
