import {Router} from 'express';
import {ExamController} from '../controllers/examController';
import {ExamService} from '../services/examService';
import {ExamRepository} from '../repositories/examRepository';
import {CourseRepository} from '../repositories/courseRepository';
import {authMiddleware} from '../security/authMiddleware';
import {roleMiddleware} from '../security/roleMiddleware';
import {UserRole} from "../types/authTypes";

const router = Router();

const examRepository = new ExamRepository();
const courseRepository = new CourseRepository();
const examService = new ExamService(examRepository, courseRepository);
const examController = new ExamController(examService);

router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/', (req, res, next) => examController.getAll(req, res, next));
router.post('/', (req, res, next) => examController.create(req, res, next));
router.get('/:id', (req, res, next) => examController.getById(req, res, next));
router.put('/:id', (req, res, next) => examController.update(req, res, next));
router.delete('/:id', (req, res, next) => examController.delete(req, res, next));

export default router;