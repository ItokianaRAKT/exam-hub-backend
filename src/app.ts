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

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api", questionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/my", studentExamRoutes);
app.use("/api", resultRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
