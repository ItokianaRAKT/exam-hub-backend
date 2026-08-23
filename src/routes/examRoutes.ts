import { Router } from "express";
import { authMiddleware } from "../security/authMiddleware";
import { roleMiddleware } from "../security/roleMiddleware";
import { UserRole } from "../types/authTypes";
import { validateExamInput } from "../validators/examValidator";
import {
  listExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/examController";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(UserRole.ADMIN));

router.get("/", listExams);
router.get("/:id", getExam);
router.post("/", validateExamInput, createExam);
router.put("/:id", validateExamInput, updateExam);
router.delete("/:id", deleteExam);

export default router;
