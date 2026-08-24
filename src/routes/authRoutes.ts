import { Router } from "express";
import { authLogin } from "../controllers/authController";
import { validateLogin } from "../validators/authValidator";

const router = Router();

router.post("/login", validateLogin, authLogin);

export default router;
