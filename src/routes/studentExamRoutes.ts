import { Router } from 'express';
import { StudentExamController } from '../controllers/studentExamController';
import { StudentExamService } from '../services/studentExamService';
import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { authMiddleware } from '../security/authMiddleware';
import { roleMiddleware } from '../security/roleMiddleware';
import { UserRole } from '../types/authTypes';

const router = Router();

const examRepository = new ExamRepository();
const questionRepository = new QuestionRepository();
const choiceRepository = new ChoiceRepository();
const attemptRepository = new AttemptRepository();

const studentExamService = new StudentExamService(
    examRepository,
    questionRepository,
    choiceRepository,
    attemptRepository
);
const studentExamController = new StudentExamController(studentExamService);

router.use(authMiddleware, roleMiddleware(UserRole.STUDENT));

router.get('/exams', (req, res, next) => studentExamController.getAvailable(req, res, next));
router.get('/exams/:id', (req, res, next) => studentExamController.getById(req, res, next));

export default router;