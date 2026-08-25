import {ExamRepository} from "../repositories/examRepository";
import {StatusCodes} from "http-status-codes";
import {CreateExam, UpdateExam} from "../models/examModel";
import {CourseRepository} from "../repositories/courseRepository"

export class ExamService {
    private examRepository: ExamRepository;
    private courseRepository: CourseRepository;

    constructor(examRepository: ExamRepository, courseRepository: CourseRepository) {
        this.examRepository = examRepository;
        this.courseRepository = courseRepository
    }

    async getAll (courseId?:string){
        return await this.examRepository.findAll(courseId);
    }

    async getById (id: string){
        const exam = await this.examRepository.findById(id);

        if (!exam){
            throw Object.assign(new Error ("Exam not found"), StatusCodes.NOT_FOUND);
        }
        return exam;
    }

    async create (data:CreateExam){
        const course = await this.courseRepository.findById(data.courseId);
        if (!course) {
            throw Object.assign(new Error("Course not found"),  StatusCodes.NOT_FOUND );
        }
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            throw Object.assign(new  Error("The start date must be earlier than the end date."), StatusCodes.BAD_REQUEST);
        }
        return this.examRepository.create(data);
    }

    async update(id: string, data:UpdateExam) {
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            throw Object.assign(new  Error("The start date must be earlier than the end date."), StatusCodes.BAD_REQUEST);
        }

        const updated = await this.examRepository.update(id, data);
        if (!updated) {
            throw Object.assign(new Error ("Exam not found"), StatusCodes.NOT_FOUND);
        }
        return updated;
    }

    async delete(id: string) {
        const exam = await this.examRepository.findById(id);
        if (!exam) {
            throw Object.assign(new Error ("Exam not found"), StatusCodes.NOT_FOUND);
        }


        const hasAttempts = await this.examRepository.hasAttempts(id);
        if (hasAttempts) {
         throw Object.assign(new Error("This exam already has attempts and cannot be deleted."), StatusCodes.CONFLICT);
        }

        return this.examRepository.delete(id);
    }

}
