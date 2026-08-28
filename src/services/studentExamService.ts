import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { StatusCodes } from 'http-status-codes';
import {createApiError} from "../types/commonTypes";

export class StudentExamService {
    private examRepository = new ExamRepository();
    private questionRepository = new QuestionRepository();
    private choiceRepository = new ChoiceRepository();
    private attemptRepository = new AttemptRepository();

    getAvailableExams = async (studentId: string, status?: string) => {
        if (status === "all") {
            const result = await this.examRepository.findAll();
            return result;
        }
        if (status === "upcoming") {
            const all = await this.examRepository.findAll();
            const now = new Date();
            return all.filter((e: any) => new Date(e.starts_at) > now);
        }
        if (status === "closed") {
            const all = await this.examRepository.findAll();
            const now = new Date();
            return all.filter((e: any) => new Date(e.ends_at) < now);
        }
        return this.examRepository.findAvailableForStudent(studentId);
    }

    getExamForStudent = async (examId: string, studentId: string) => {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Exam not found", StatusCodes.NOT_FOUND);
        }

        const now = new Date();
        if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
            throw createApiError("This exam is not available.", StatusCodes.FORBIDDEN);
        }

        const alreadyAttempted = await this.attemptRepository.existsByExamAndStudent(examId, studentId);
        if (alreadyAttempted) {
            throw createApiError("You already passed this exam.", StatusCodes.FORBIDDEN);
        }

        const questions = await this.questionRepository.findByExamId(examId);
        const questionsWithChoices = [];
        for (const q of questions) {
            const choices = await this.choiceRepository.findByQuestionId(q.id);
            questionsWithChoices.push({
                id: q.id,
                text: q.statement,
                points: q.points,
                choices: choices.map((c: any) => ({
                    id: c.id,
                    text: c.text
                }))
            });
        }

        return {
            id: exam.id,
            title: exam.title,
            description: exam.description,
            startDate: exam.starts_at,
            endDate: exam.ends_at,
            questions: questionsWithChoices
        };
    }
}
