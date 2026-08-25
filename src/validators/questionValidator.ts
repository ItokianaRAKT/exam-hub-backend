import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createApiError } from "../types/commonTypes";

interface ChoiceInput {
    text: string;
    isCorrect: boolean;
}

export function validateQuestionInput(req: Request, _res: Response, next: NextFunction): void {
    const { statement, points, choices } = req.body;

    if (!statement || typeof statement !== "string" || statement.trim() === "") {
        next(createApiError("Le champ 'statement' est obligatoire", StatusCodes.BAD_REQUEST));
        return;
    }
    if (points === undefined || typeof points !== "number" || points <= 0) {
        next(createApiError("Le champ 'points' doit être un nombre supérieur à 0", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!Array.isArray(choices)) {
        next(createApiError("Le champ 'choices' doit être un tableau", StatusCodes.BAD_REQUEST));
        return;
    }
    if (choices.length < 2 || choices.length > 6) {
        next(createApiError("Une question doit avoir entre 2 et 6 choix", StatusCodes.BAD_REQUEST));
        return;
    }

    for (const choice of choices as ChoiceInput[]) {
        if (!choice.text || typeof choice.text !== "string" || choice.text.trim() === "") {
            next(createApiError("Chaque choix doit avoir un champ 'text' non vide", StatusCodes.BAD_REQUEST));
            return;
        }
        if (typeof choice.isCorrect !== "boolean") {
            next(createApiError("Chaque choix doit avoir un champ 'isCorrect' booléen", StatusCodes.BAD_REQUEST));
            return;
        }
    }

    const correctCount = (choices as ChoiceInput[]).filter(c => c.isCorrect).length;
    if (correctCount !== 1) {
        next(createApiError("Une question doit avoir exactement un choix correct", StatusCodes.BAD_REQUEST));
        return;
    }

    next();
}
