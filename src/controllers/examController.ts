import {Request, Response, NextFunction} from 'express';
import {ExamService} from '../services/examService';

export class ExamController {
    private examService: ExamService;

    constructor(examService: ExamService) {
        this.examService = examService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const courseId = req.query.courseId as string | undefined;
            const exams = await this.examService.getAll(courseId);
            res.status(200).json(exams);
        } catch (err) {
            next(err);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const exam = await this.examService.getById(<string>req.params.id);
            res.status(200).json(exam);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const exam = await this.examService.create(req.body);
            res.status(201).json(exam);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const exam = await this.examService.update(<string>req.params.id, req.body);
            res.status(200).json(exam);
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.examService.delete(<string>req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}
