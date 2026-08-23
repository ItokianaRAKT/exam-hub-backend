import express from "express";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
