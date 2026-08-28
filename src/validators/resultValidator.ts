import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createApiError } from "../types/commonTypes";

export const validateSubmitExam = (req: Request, _res: Response, next: NextFunction): void => {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
        next(createApiError("The 'answers' field must be an array.", StatusCodes.BAD_REQUEST));
        return;
    }

    for (const answer of answers) {
        if (!answer.questionId || typeof answer.questionId !== "string") {
            next(createApiError("Each answer must have a 'questionId' field.", StatusCodes.BAD_REQUEST));
            return;
        }
        if (answer.choiceId !== null && typeof answer.choiceId !== "string") {
            next(createApiError("The 'choiceId' field must be a string or null.", StatusCodes.BAD_REQUEST));
            return;
        }
    }

    next();
};
