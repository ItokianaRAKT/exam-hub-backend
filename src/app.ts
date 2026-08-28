import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import studentRoutes from "./routes/studentRoutes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import resultRoutes from "./routes/resultRoutes";
import examRoutes from "./routes/examRoutes";
import questionRoutes from "./routes/questionRoutes";
import studentExamRoutes from "./routes/studentExamRoutes";

const app = express();

app.disable("x-powered-by");

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && now > record.resetAt) {
    loginAttempts.delete(ip);
  }

  const current = loginAttempts.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  current.count++;
  loginAttempts.set(ip, current);

  if (current.count > RATE_LIMIT_MAX) {
    res.status(429).json({ message: "Trop de tentatives. Réessayez plus tard." });
    return;
  }

  next();
};

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use("/api/auth/login", rateLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/my", studentExamRoutes);
app.use("/api", resultRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api", questionRoutes);
app.use("/api/students", studentRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
