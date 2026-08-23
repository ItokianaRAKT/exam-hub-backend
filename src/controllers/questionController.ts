import { Request, Response, NextFunction } from 'express';
import {QuestionService} from "../services/questionService";



export class QuestionController {
    private questionService : QuestionService;


    constructor(questionService: QuestionService) {
        this.questionService = questionService;
    }

    async getByExamId(req: Request, res: Response, next: NextFunction) {
        try {
            const questions = await this.questionService.getByExamId(<string>req.params.id);
            res.status(200).json(questions);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const question = await this.questionService.create(<string>req.params.id, req.body);
            res.status(201).json(question);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const question = await this.questionService.update(<string>req.params.id, req.body);
            res.status(200).json(question);
        } catch (err) {
            next(err);
        }
    }


    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.questionService.delete(<string>req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
}