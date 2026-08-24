import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import studentRoutes from "./routes/studentRoutes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import resultRoutes from "./routes/resultRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", resultRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
