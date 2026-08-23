import { Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ message: `Route non trouvée: ${req.method} ${req.originalUrl}` });
}
