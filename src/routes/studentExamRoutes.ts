import {Router} from 'express';
import {StudentExamController} from '../controllers/studentExamController';
import {StudentExamService} from '../services/studentExamService';
import {authMiddleware} from '../security/authMiddleware';
import {roleMiddleware} from '../security/roleMiddleware';
import {UserRole} from "../types/authTypes";

const router = Router();

const studentExamService = new StudentExamService();
const studentExamController = new StudentExamController(studentExamService);

router.use(authMiddleware, roleMiddleware(UserRole.STUDENT));

router.get('/exams', (req, res, next) => studentExamController.getAvailable(req, res, next));
router.get('/exams/:id', (req, res, next) => studentExamController.getById(req, res, next));

export default router;
