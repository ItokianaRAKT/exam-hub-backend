import { Request, Response, NextFunction } from 'express';
import {QuestionService} from "../services/questionService";

const mapQuestionOutput = (q: any) => {
    return {
        id: q.id,
        text: q.statement,
        points: q.points,
        choices: (q.choices || []).map((c: any) => ({
            id: c.id,
            text: c.text,
            isCorrect: c.is_correct ?? c.isCorrect
        }))
    };
};

const mapChoiceInput = (choice: any) => {
    return { text: choice.text ?? choice.label, isCorrect: choice.isCorrect };
};

const mapBodyInput = (body: any) => {
    return {
        statement: body.text ?? body.statement,
        points: body.points,
        choices: (body.choices || []).map(mapChoiceInput)
    };
};

export class QuestionController {
    private questionService : QuestionService;

    constructor(questionService: QuestionService) {
        this.questionService = questionService;
    }

    getByExamId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questions = await this.questionService.getByExamId(<string>req.params.id);
            res.status(200).json(questions.map(mapQuestionOutput));
        } catch (err) {
            next(err);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const question = await this.questionService.create(<string>req.params.id, mapBodyInput(req.body));
            res.status(201).json(mapQuestionOutput(question));
        } catch (err) {
            next(err);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const question = await this.questionService.update(<string>req.params.id, mapBodyInput(req.body));
            res.status(200).json(mapQuestionOutput(question));
        } catch (err) {
            next(err);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.questionService.delete(<string>req.params.id);
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    };
}
