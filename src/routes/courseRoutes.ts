import { Router } from "express";
import { authMiddleware } from "../security/authMiddleware";
import { roleMiddleware } from "../security/roleMiddleware";
import { UserRole } from "../types/authTypes";
import { validateCourseCreate, validateCourseUpdate } from "../validators/courseValidator";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(UserRole.ADMIN));

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", validateCourseCreate, createCourse);
router.put("/:id", validateCourseUpdate, updateCourse);
router.delete("/:id", deleteCourse);

export default router;
