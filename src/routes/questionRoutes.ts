import {Router} from 'express';
import {QuestionController} from '../controllers/questionController';
import {QuestionService} from '../services/questionService';
import {QuestionRepository} from '../repositories/questionRepository';
import {ExamRepository} from '../repositories/examRepository';
import {authMiddleware} from '../security/authMiddleware';
import {roleMiddleware} from '../security/roleMiddleware';
import {UserRole} from "../types/authTypes";
import {validateQuestionInput} from '../validators/questionValidator';

const router = Router();

const questionRepository = new QuestionRepository();
const examRepository = new ExamRepository();
const questionService = new QuestionService(questionRepository, examRepository);
const questionController = new QuestionController(questionService);

router.use(authMiddleware, roleMiddleware(UserRole.ADMIN));

router.get('/exams/:id/questions', (req, res, next) => questionController.getByExamId(req, res, next));
router.post('/exams/:id/questions', validateQuestionInput, (req, res, next) => questionController.create(req, res, next));
router.put('/questions/:id', validateQuestionInput, (req, res, next) => questionController.update(req, res, next));
router.delete('/questions/:id', (req, res, next) => questionController.delete(req, res, next));

export default router;
