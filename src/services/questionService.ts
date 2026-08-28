import {ChoiceInput} from "../models/choiceModel";
import {StatusCodes} from "http-status-codes";
import {QuestionInput} from "../models/questionModel";
import {QuestionRepository} from "../repositories/questionRepository";
import {ExamRepository} from "../repositories/examRepository";
import {createApiError} from "../types/commonTypes";

export class QuestionService {
    private questionRepository : QuestionRepository
    private examRepository : ExamRepository;

    constructor(questionRepository: QuestionRepository, examRepository: ExamRepository) {
        this.questionRepository = questionRepository;
        this.examRepository = examRepository;
    }

    private validateChoices = (choices: ChoiceInput[]) => {
        if (choices.length < 2 || choices.length > 6) {
            throw createApiError("Une question doit avoir entre 2 et 6 choix", StatusCodes.BAD_REQUEST)
        }
        const correctCount = choices.filter(c => c.isCorrect).length;
        if (correctCount !== 1) {
            throw createApiError("Une question doit avoir une seule bonne réponse", StatusCodes.BAD_REQUEST)
        }
    }

    getByExamId = async (examId: string) => {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }
        return this.questionRepository.findByExamId(examId);
    }

    create = async (examId: string, data: QuestionInput) => {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }

        const hasAttempts = await this.examRepository.hasAttempts(examId);
        if (hasAttempts) {
            throw createApiError("Cet examen a déjà été tenté et ne peut plus être modifié", StatusCodes.CONFLICT);
        }

        this.validateChoices(data.choices);

        return this.questionRepository.createWithChoices(examId, data);
    }

    update = async (id: string, data: QuestionInput) => {
        const question = await this.questionRepository.findById(id);
        if (!question) {
            throw createApiError("Question introuvable", StatusCodes.NOT_FOUND);
        }

        const hasAttempts = await this.examRepository.hasAttempts(question.exam_id);
        if (hasAttempts) {
            throw createApiError("Cet examen a déjà été tenté et ne peut plus être modifié", StatusCodes.CONFLICT);
        }

        this.validateChoices(data.choices);

        return this.questionRepository.updateWithChoices(id, data);
    }

    delete = async (id: string) => {
        const question = await this.questionRepository.findById(id);
        if (!question) {
            throw createApiError("Question introuvable", StatusCodes.NOT_FOUND);
        }

        const hasAttempts = await this.examRepository.hasAttempts(question.exam_id);
        if (hasAttempts) {
            throw createApiError("Cet examen a déjà été tenté et ne peut plus être supprimé", StatusCodes.CONFLICT);
        }

        return this.questionRepository.delete(id);
    }
}
