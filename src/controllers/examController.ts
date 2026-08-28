import {Request, Response, NextFunction} from 'express';
import {ExamService} from '../services/examService';

export class ExamController {
    private examService: ExamService;

    constructor(examService: ExamService) {
        this.examService = examService;
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.query.courseId as string | undefined;
            const exams = await this.examService.getAll(courseId);
            const mapped = exams.map((e: any) => ({
                id: e.id,
                title: e.title,
                description: e.description,
                courseId: e.course_id,
                startDate: e.starts_at,
                endDate: e.ends_at,
                questionCount: e.questionCount,
                attemptCount: e.attemptCount,
                totalPoints: e.totalPoints,
                course: e.course_code ? {
                    id: e.course_id,
                    code: e.course_code,
                    name: e.course_name,
                    description: e.course_description
                } : null
            }));
            res.status(200).json(mapped);
        } catch (err) {
            next(err);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const exam: any = await this.examService.getDetailById(<string>req.params.id);
            const mapped: any = {
                id: exam.id,
                title: exam.title,
                description: exam.description,
                courseId: exam.course_id,
                startDate: exam.starts_at,
                endDate: exam.ends_at,
                questionCount: exam.questionCount,
                attemptCount: exam.attemptCount,
                totalPoints: exam.totalPoints,
                course: exam.course_code ? {
                    id: exam.course_id,
                    code: exam.course_code,
                    name: exam.course_name,
                    description: exam.course_description
                } : null,
                questions: (exam.questions || []).map((q: any) => ({
                    id: q.id,
                    text: q.statement,
                    points: q.points,
                    choices: q.choices || []
                }))
            };
            res.status(200).json(mapped);
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description, courseId, startDate, endDate } = req.body;
            const exam: any = await this.examService.create({
                title, description, courseId, startsAt: startDate, endsAt: endDate
            });
            res.status(201).json({
                id: exam.id,
                title: exam.title,
                description: exam.description,
                courseId: exam.course_id,
                startDate: exam.starts_at,
                endDate: exam.ends_at
            });
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description, startDate, endDate } = req.body;
            const exam: any = await this.examService.update(<string>req.params.id, {
                title, description, startsAt: startDate, endsAt: endDate
            });
            res.status(200).json({
                id: exam!.id,
                title: exam!.title,
                description: exam!.description,
                courseId: exam!.course_id,
                startDate: exam!.starts_at,
                endDate: exam!.ends_at
            });
        } catch (err) {
            next(err);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.examService.delete(<string>req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}
