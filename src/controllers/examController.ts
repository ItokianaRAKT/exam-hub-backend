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
            const mapped = exams.map((e: any) => this.mapDetail(e));
            res.status(200).json(mapped);
        } catch (err) {
            next(err);
        }
    };

    private mapDetail = (exam: any) => ({
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
        } : null
    });

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const exam: any = await this.examService.getDetailById(<string>req.params.id);
            const mapped: any = {
                ...this.mapDetail(exam),
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
                title, description, courseId, startsAt: new Date(startDate), endsAt: new Date(endDate)
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
            const { title, description, courseId, startDate, endDate } = req.body;
            const id = <string>req.params.id;
            await this.examService.update(id, {
                courseId, title, description, startsAt: new Date(startDate), endsAt: new Date(endDate)
            });
            const exam: any = await this.examService.getDetailById(id);
            res.status(200).json(this.mapDetail(exam));
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
