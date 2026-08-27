import { Request, Response, NextFunction } from 'express';
import {QuestionService} from "../services/questionService";

function mapQuestionOutput(q: any) {
    return {
        id: q.id,
        text: q.statement,
        points: q.points,
        choices: (q.choices || []).map((c: any) => ({
            id: c.id,
            text: c.label ?? c.text,
            isCorrect: c.is_correct ?? c.isCorrect
        }))
    };
}

function mapChoiceInput(choice: any) {
    return { label: choice.text ?? choice.label, isCorrect: choice.isCorrect };
}

function mapBodyInput(body: any) {
    return {
        statement: body.text ?? body.statement,
        points: body.points,
        choices: (body.choices || []).map(mapChoiceInput)
    };
}

export class QuestionController {
    private questionService : QuestionService;


    constructor(questionService: QuestionService) {
        this.questionService = questionService;
    }

    async getByExamId(req: Request, res: Response, next: NextFunction) {
        try {
            const questions = await this.questionService.getByExamId(<string>req.params.id);
            res.status(200).json(questions.map(mapQuestionOutput));
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const question = await this.questionService.create(<string>req.params.id, mapBodyInput(req.body));
            res.status(201).json(mapQuestionOutput(question));
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const question = await this.questionService.update(<string>req.params.id, mapBodyInput(req.body));
            res.status(200).json(mapQuestionOutput(question));
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