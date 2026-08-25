import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import studentRoutes from "./routes/studentRoutes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import examRoutes from "./routes/examRoutes";
import questionRoutes from "./routes/questionRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api", questionRoutes);
app.use("/api/students", studentRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
