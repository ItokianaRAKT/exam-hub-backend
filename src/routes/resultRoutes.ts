import { Router } from 'express';
import { ResultController } from '../controllers/resultController';
import { authMiddleware } from '../security/authMiddleware';
import { roleMiddleware } from '../security/roleMiddleware';
import { validateSubmitExam } from '../validators/resultValidator';
import { UserRole } from '../types/authTypes';
import {ResultService} from "../services/resultService";

const router = Router();
const resultService = new ResultService();
const resultController = new ResultController(resultService);


router.post(
    '/my/exams/:id/submit',
    authMiddleware,
    roleMiddleware(UserRole.STUDENT),
    validateSubmitExam,
    (req, res, next) => resultController.submit(req, res, next)
);

router.get(
    '/my/exams/:id/result',
    authMiddleware,
    roleMiddleware(UserRole.STUDENT),
    (req, res, next) => resultController.getResult(req, res, next)
);

router.get(
    '/my/results',
    authMiddleware,
    roleMiddleware(UserRole.STUDENT),
    (req, res, next) => resultController.getMyResults(req, res, next)
);


router.get(
    '/exams/:id/results',
    authMiddleware,
    roleMiddleware(UserRole.ADMIN),
    (req, res, next) => resultController.getExamResults(req, res, next)
);

export default router;
