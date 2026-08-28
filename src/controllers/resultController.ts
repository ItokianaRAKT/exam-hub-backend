import { Request, Response, NextFunction } from 'express';
import { ResultService } from '../services/resultService';

export class ResultController {
    private resultService: ResultService;

    constructor(resultService: ResultService) {
        this.resultService = resultService;
    }

    submit = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const examId = req.params.id as string;
            const studentId = req.user!.userId;
            const answers = req.body.answers ?? [];

            const result = await this.resultService.submitExam(examId, studentId, answers);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getResult = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const examId = req.params.id as string;
            const studentId = req.user!.userId;

            const result = await this.resultService.getStudentResultForExam(examId, studentId);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getMyResults = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const studentId = req.user!.userId;
            const results = await this.resultService.getStudentResults(studentId);
            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    };

    getExamResults = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const examId = req.params.id as string;
            const results = await this.resultService.getExamResults(examId);
            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    };
}
