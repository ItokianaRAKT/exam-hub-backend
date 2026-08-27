import { Request, Response, NextFunction } from 'express';
import { StudentExamService } from '../services/studentExamService';

export class StudentExamController {
    private studentExamService: StudentExamService;

    constructor(studentExamService: StudentExamService) {
        this.studentExamService = studentExamService;
    }

    async getAvailable(req: Request, res: Response, next: NextFunction) {
        try {
            const studentId = String(req.user!.userId);
            const exams = await this.studentExamService.getAvailableExams(studentId);
            res.status(200).json(exams);
        } catch (err) {
            next(err);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const studentId = String(req.user!.userId);
            const exam = await this.studentExamService.getExamForStudent(<string>req.params.id, studentId);
            res.status(200).json(exam);
        } catch (err) {
            next(err);
        }
    }
}