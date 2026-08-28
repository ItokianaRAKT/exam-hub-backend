import { Request, Response, NextFunction } from 'express';
import {StudentExamService} from '../services/studentExamService';
import { createApiError } from '../types/commonTypes';

export class StudentExamController {
    private studentExamService: StudentExamService;

    constructor(studentExamService: StudentExamService) {
        this.studentExamService = studentExamService;
    }

    getAvailable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw createApiError("Non authentifié", 401);
            }
            const studentId = String(req.user.userId);
            const status = req.query.status as string | undefined;
            const exams = await this.studentExamService.getAvailableExams(studentId, status);
            res.status(200).json(exams.map((e: any) => ({
                id: e.id,
                title: e.title,
                description: e.description,
                courseId: e.course_id,
                startDate: e.starts_at,
                endDate: e.ends_at,
                questionCount: e.questionCount,
                totalPoints: e.totalPoints
            })));
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw createApiError("Non authentifié", 401);
            }
            const studentId = String(req.user.userId);
            const exam = await this.studentExamService.getExamForStudent(<string>req.params.id, studentId);
            res.status(200).json(exam);
        } catch (err) {
            next(err);
        }
    };
}
