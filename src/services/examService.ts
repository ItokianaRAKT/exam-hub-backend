import {ExamRepository} from "../repositories/examRepository";
import {StatusCodes} from "http-status-codes";

export class ExamService {
    private examRepository: ExamRepository;

    constructor(examRepository: ExamRepository) {
        this.examRepository = examRepository;
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

    async create (data:{courseId: string; title: string; description: string; startsAt: Date; endsAt: Date}){
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            throw Object.assign(new  Error("The start date must be earlier than the end date."), StatusCodes.BAD_REQUEST);
        }
        return this.examRepository.create(data);
    }

    async update(id: string, data: { title: string; description: string; startAt: Date; endAt: Date }) {
        if (new Date(data.startAt) >= new Date(data.endAt)) {
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
