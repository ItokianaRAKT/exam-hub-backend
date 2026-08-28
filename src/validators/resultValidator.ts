import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createApiError } from "../types/commonTypes";

export const validateSubmitExam = (req: Request, _res: Response, next: NextFunction): void => {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
        next(createApiError("Le champ 'answers' doit être un tableau", StatusCodes.BAD_REQUEST));
        return;
    }

    for (const answer of answers) {
        if (!answer.questionId || typeof answer.questionId !== "string") {
            next(createApiError("Chaque réponse doit avoir un champ 'questionId'", StatusCodes.BAD_REQUEST));
            return;
        }
        if (answer.choiceId !== null && typeof answer.choiceId !== "string") {
            next(createApiError("Le champ 'choiceId' doit être une chaîne de caractères ou null", StatusCodes.BAD_REQUEST));
            return;
        }
    }

    next();
};
