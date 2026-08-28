import {ExamRepository} from "../repositories/examRepository";
import {StatusCodes} from "http-status-codes";
import {CreateExam, UpdateExam} from "../models/examModel";
import {CourseRepository} from "../repositories/courseRepository"
import {createApiError} from "../types/commonTypes";

export class ExamService {
    private examRepository: ExamRepository;
    private courseRepository: CourseRepository;

    constructor(examRepository: ExamRepository, courseRepository: CourseRepository) {
        this.examRepository = examRepository;
        this.courseRepository = courseRepository
    }

    getAll = async (courseId?:string) => {
        return await this.examRepository.findAll(courseId);
    }

    getById = async (id: string) => {
        const exam = await this.examRepository.findById(id);

        if (!exam){
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }
        return exam;
    }

    getDetailById = async (id: string) => {
        const exam = await this.examRepository.findDetailById(id);

        if (!exam){
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }
        return exam;
    }

    create = async (data:CreateExam) => {
        const course = await this.courseRepository.findById(data.courseId);
        if (!course) {
            throw createApiError("Cours introuvable", StatusCodes.NOT_FOUND);
        }
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            throw createApiError("La date de début doit être antérieure à la date de fin", StatusCodes.BAD_REQUEST);
        }
        return this.examRepository.create(data);
    }

    update = async (id: string, data:UpdateExam) => {
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            throw createApiError("La date de début doit être antérieure à la date de fin", StatusCodes.BAD_REQUEST);
        }

        const updated = await this.examRepository.update(id, data);
        if (!updated) {
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }
        return updated;
    }

    delete = async (id: string) => {
        const exam = await this.examRepository.findById(id);
        if (!exam) {
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }


        const hasAttempts = await this.examRepository.hasAttempts(id);
        if (hasAttempts) {
         throw createApiError("Cet examen a déjà été tenté et ne peut plus être supprimé", StatusCodes.CONFLICT);
        }

        return this.examRepository.delete(id);
    }

}
