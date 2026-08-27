
import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { AnswerRepository } from '../repositories/answerRepository';
import {SubmitAnswerInput} from '../models/answerModel';
import {StatusCodes} from "http-status-codes";
import {createApiError} from "../types/commonTypes";


export class ResultService {
    private examRepository = new ExamRepository();
    private questionRepository = new QuestionRepository();
    private choiceRepository = new ChoiceRepository();
    private attemptRepository = new AttemptRepository();
    private answerRepository = new AnswerRepository();

    async submitExam(examId: string, studentId: string, answers: SubmitAnswerInput[]) {

        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Exam not found", StatusCodes.NOT_FOUND);
        }

        const now = new Date();
        if (now < new Date(exam.start_at) || now > new Date(exam.end_at)) {
            throw createApiError("this exam is not available", StatusCodes.FORBIDDEN);
        }

        const alreadyAttempted = await this.attemptRepository.existsByExamAndStudent(examId, studentId);
        if (alreadyAttempted) {
            throw createApiError("you already pass this exam", StatusCodes.CONFLICT);
        }

        const questions = await this.questionRepository.findByExamId(examId);

        let score = 0;
        const preparedAnswers = [];
        const correction = [];

        for (const question of questions) {
            const submitted = answers.find(a => a.questionId === question.id);
            const submittedChoiceId = submitted?.choiceId ?? null;

            const correctChoiceId = await this.choiceRepository.findCorrectChoiceId(question.id);
            const isCorrect = submittedChoiceId !== null && submittedChoiceId === correctChoiceId;


            if (isCorrect) {
                score += question.points;
            }

            preparedAnswers.push({
                questionId: question.id,
                choiceId: submittedChoiceId
            });


            correction.push({
                questionId: question.id,
                text: question.text,
                points: question.points,
                studentChoiceId: submittedChoiceId,
                correctChoiceId: correctChoiceId,
                isCorrect
            });
        }


        const attempt = await this.attemptRepository.createWithAnswers(
            { examId, studentId, answers: preparedAnswers },
            score
        );

        return {
            attemptId: attempt.id,
            examId: attempt.examId,
            score: attempt.score,
            submittedAt: attempt.submittedAt,
            correction
        };
    }


    async getStudentResultForExam(examId: string, studentId: string) {
        const attempt = await this.attemptRepository.findByExamAndStudent(examId, studentId);
        if (!attempt) {
            throw createApiError("you didn't pass yet this exam", StatusCodes.NOT_FOUND);
        }

        const answers = await this.answerRepository.findByAttemptId(attempt.id);
        const questions = await this.questionRepository.findByExamId(examId);

        const correction = [];
        for (const question of questions) {
            const answer = answers.find((a: any) => a.question_id === question.id);
            const correctChoiceId = await this.choiceRepository.findCorrectChoiceId(question.id);
            const studentChoiceId = answer?.choice_id ?? null;

            correction.push({
                questionId: question.id,
                text: question.text,
                points: question.points,
                studentChoiceId,
                correctChoiceId,
                isCorrect: studentChoiceId !== null && studentChoiceId === correctChoiceId
            });
        }

        return {
            attemptId: attempt.id,
            examId: attempt.exam_id,
            score: attempt.score,
            submittedAt: attempt.submitted_at,
            correction
        };
    }

    async getStudentResults(studentId: string) {
        return this.attemptRepository.findByStudentId(studentId);
    }

    async getExamResults(examId: string) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Exam not found", StatusCodes.NOT_FOUND);
        }

        const attempts = await this.attemptRepository.findByExamId(examId);
        const totalAttempts = attempts.length;
        const average = totalAttempts === 0
            ? 0
            : attempts.reduce((sum: number, a: any) => sum + a.score, 0) / totalAttempts;

        return {
            examId,
            totalAttempts,
            average,
            results: attempts.map((a: any) => ({
                studentId: a.student_id,
                score: a.score,
                submittedAt: a.submitted_at
            }))
        };
    }
}