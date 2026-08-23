import {ChoiceInput} from "../models/choiceModel";
import {StatusCodes} from "http-status-codes";
import {QuestionInput} from "../models/questionModel";
import {QuestionRepository} from "../repositories/questionRepository";
import {ExamRepository} from "../repositories/examRepository";

export class QuestionService {
    private questionRepository : QuestionRepository
    private examRepository : ExamRepository;


    constructor(questionRepository: QuestionRepository, examRepository: ExamRepository) {
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
    }


    private validateChoices(choices: ChoiceInput[]) {
        if (choices.length < 2 || choices.length > 6) {
            throw Object.assign(new Error("one question must have 2 to 6 choices"), StatusCodes.BAD_REQUEST)
        }
        const correctCount = choices.filter(c => c.isCorrect).length;
        if (correctCount !== 1) {
            throw Object.assign(new Error("one question must have one correct answer"), StatusCodes.BAD_REQUEST)
        }
    }

    async getByExamId(examId: string) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw Object.assign(new Error("Exam not found"), StatusCodes.NOT_FOUND);
        }
        return this.questionRepository.findByExamId(examId);
    }

    async create(examId: string, data: QuestionInput) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw Object.assign(new Error("Exam not found"), StatusCodes.NOT_FOUND);
        }

        const hasAttempts = await this.examRepository.hasAttempts(examId);
        if (hasAttempts) {
            throw Object.assign(new Error("This exam already has attempts and cannot be modified."), StatusCodes.CONFLICT);
        }

        this.validateChoices(data.choices);

        return this.questionRepository.createWithChoices(examId, data);
    }

    async update(id: string, data: QuestionInput) {
        const question = await this.questionRepository.findById(id);
        if (!question) {
            throw Object.assign(new Error("Exam not found"), StatusCodes.NOT_FOUND);
        }

        const hasAttempts = await this.examRepository.hasAttempts(question.exam_id);
        if (hasAttempts) {
            throw Object.assign(new Error("This exam already has attempts and cannot be modified."), StatusCodes.CONFLICT);
        }

        this.validateChoices(data.choices);

        return this.questionRepository.updateWithChoices(id, data);
    }

    async delete(id: string) {
        const question = await this.questionRepository.findById(id);
        if (!question) {
            throw Object.assign(new Error("Exam not found"), StatusCodes.NOT_FOUND);
        }


        const hasAttempts = await this.examRepository.hasAttempts(question.exam_id);
        if (hasAttempts) {
            throw Object.assign(new Error("This exam already has attempts and cannot be deleted."), StatusCodes.CONFLICT);
        }

        return this.questionRepository.delete(id);
    }
}
