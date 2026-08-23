import express from "express";
import cors from "cors";
import examRoutes from "./routes/examRoutes";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/exams", examRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
