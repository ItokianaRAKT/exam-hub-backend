import express from "express";
import cors from "cors";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", (req, res) => {
  res.status(404).json({ message: "Endpoint non trouvé" });
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
