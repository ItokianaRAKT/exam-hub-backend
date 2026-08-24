import { Router } from "express";
import { authMiddleware } from "../security/authMiddleware";
import { roleMiddleware } from "../security/roleMiddleware";
import { UserRole } from "../types/authTypes";
import { validateStudentCreate, validateStudentUpdate } from "../validators/studentValidator";
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  activateStudent,
} from "../controllers/studentController";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(UserRole.ADMIN));

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", validateStudentCreate, createStudent);
router.put("/:id", validateStudentUpdate, updateStudent);
router.delete("/:id", deleteStudent);
router.post("/:id/activate", activateStudent);

export default router;
