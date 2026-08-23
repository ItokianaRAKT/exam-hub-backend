import { Request, Response, NextFunction } from "express";
import { ApiError } from "../types/commonTypes";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if ("statusCode" in err) {
    const apiErr = err as ApiError;
    res.status(apiErr.statusCode).json({ message: apiErr.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
}
