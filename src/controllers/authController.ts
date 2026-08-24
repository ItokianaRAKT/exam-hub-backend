import { Request, Response, NextFunction } from "express";
import { login } from "../services/authService";

export async function authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
