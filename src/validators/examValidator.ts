import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createApiError } from "../types/commonTypes";

export function validateExamCreate(req: Request, _res: Response, next: NextFunction): void {
    const { courseId, title, description, startsAt, endsAt } = req.body;

    if (!courseId || typeof courseId !== "string" || courseId.trim() === "") {
        next(createApiError("Le champ 'courseId' est obligatoire", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
        next(createApiError("Le champ 'title' est obligatoire", StatusCodes.BAD_REQUEST));
        return;
    }
    if (description !== undefined && typeof description !== "string") {
        next(createApiError("Le champ 'description' doit être une chaîne de caractères", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!startsAt || isNaN(Date.parse(startsAt))) {
        next(createApiError("Le champ 'startsAt' doit être une date valide", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!endsAt || isNaN(Date.parse(endsAt))) {
        next(createApiError("Le champ 'endsAt' doit être une date valide", StatusCodes.BAD_REQUEST));
        return;
    }
    if (new Date(startsAt) >= new Date(endsAt)) {
        next(createApiError("La date de début doit être antérieure à la date de fin", StatusCodes.BAD_REQUEST));
        return;
    }

    next();
}

export function validateExamUpdate(req: Request, _res: Response, next: NextFunction): void {
    const { title, description, startsAt, endsAt } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        next(createApiError("The 'title' field is required.", StatusCodes.BAD_REQUEST));
        return;
    }
    if (description !== undefined && typeof description !== "string") {
        next(createApiError("The 'description' field must be a string.", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!startsAt || isNaN(Date.parse(startsAt))) {
        next(createApiError("The 'startsAt' field must be a valid date.", StatusCodes.BAD_REQUEST));
        return;
    }
    if (!endsAt || isNaN(Date.parse(endsAt))) {
        next(createApiError("The 'endsAt' field must be a valid date.", StatusCodes.BAD_REQUEST));
        return;
    }
    if (new Date(startsAt) >= new Date(endsAt)) {
        next(createApiError("The start date must be earlier than the end date.", StatusCodes.BAD_REQUEST));
        return;
    }

    next();
}
