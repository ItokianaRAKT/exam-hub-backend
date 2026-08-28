
import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { AnswerRepository } from '../repositories/answerRepository';
import * as userRepository from '../repositories/userRepository';
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
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }

        const now = new Date();
        if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
            throw createApiError("Cet examen n'est pas disponible", StatusCodes.FORBIDDEN);
        }

        const alreadyAttempted = await this.attemptRepository.existsByExamAndStudent(examId, studentId);
        if (alreadyAttempted) {
            throw createApiError("Vous avez déjà passé cet examen", StatusCodes.CONFLICT);
        }

        const questions = await this.questionRepository.findByExamId(examId);
        const questionIds = questions.map((q: any) => q.id);
        const correctChoiceMap = await this.choiceRepository.findCorrectChoiceIds(questionIds);

        let score = 0;
        const preparedAnswers = [];
        const correction = [];

        for (const question of questions) {
            const submitted = answers.find(a => a.questionId === question.id);
            const submittedChoiceId = submitted?.choiceId ?? null;

            const correctChoiceId = correctChoiceMap.get(question.id) ?? null;
            const isCorrect = submittedChoiceId !== null && submittedChoiceId === correctChoiceId;


            if (isCorrect) {
                score += Number(question.points);
            }

            preparedAnswers.push({
                questionId: question.id,
                choiceId: submittedChoiceId
            });


            correction.push({
                questionId: question.id,
                text: question.statement,
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
            id: attempt.id,
            studentId: studentId,
            examId: attempt.exam_id,
            examTitle: exam.title,
            score: attempt.score,
            maxScore: questions.reduce((sum: number, q: any) => sum + Number(q.points), 0),
            submittedAt: attempt.submitted_at,
            corrections: correction.map((c: any) => ({
                questionId: c.questionId,
                questionText: c.text,
                chosenChoiceId: c.studentChoiceId,
                correctChoiceId: c.correctChoiceId,
                isCorrect: c.isCorrect,
                pointsEarned: c.isCorrect ? c.points : 0,
                pointsPossible: c.points
            }))
        };
    }


    async getStudentResultForExam(examId: string, studentId: string) {
        const attempt = await this.attemptRepository.findByExamAndStudent(examId, studentId);
        if (!attempt) {
            throw createApiError("Vous n'avez pas encore passé cet examen", StatusCodes.NOT_FOUND);
        }

        const exam = await this.examRepository.findById(examId);
        const answers = await this.answerRepository.findByAttemptId(attempt.id);
        const questions = await this.questionRepository.findByExamId(examId);
        const questionIds = questions.map((q: any) => q.id);
        const correctChoiceMap = await this.choiceRepository.findCorrectChoiceIds(questionIds);

        const correction = [];
        for (const question of questions) {
            const answer = answers.find((a: any) => a.question_id === question.id);
            const correctChoiceId = correctChoiceMap.get(question.id) ?? null;
            const studentChoiceId = answer?.choice_id ?? null;

            correction.push({
                questionId: question.id,
                text: question.statement,
                points: question.points,
                studentChoiceId,
                correctChoiceId,
                isCorrect: studentChoiceId !== null && studentChoiceId === correctChoiceId
            });
        }

        return {
            id: attempt.id,
            studentId: attempt.student_id,
            examId: attempt.exam_id,
            examTitle: exam?.title ?? "",
            score: attempt.score,
            maxScore: questions.reduce((sum: number, q: any) => sum + Number(q.points), 0),
            submittedAt: attempt.submitted_at,
            corrections: correction.map((c: any) => ({
                questionId: c.questionId,
                questionText: c.text,
                chosenChoiceId: c.studentChoiceId,
                correctChoiceId: c.correctChoiceId,
                isCorrect: c.isCorrect,
                pointsEarned: c.isCorrect ? c.points : 0,
                pointsPossible: c.points
            }))
        };
    }

    async getStudentResults(studentId: string) {
        const attempts = await this.attemptRepository.findByStudentId(studentId);
        if (attempts.length === 0) return [];

        const examIds = [...new Set(attempts.map((a: any) => a.exam_id))];
        const exams = await Promise.all(examIds.map((id: string) => this.examRepository.findById(id)));
        const examsMap = new Map(exams.filter(Boolean).map((e: any) => [e.id, e]));

        const allQuestionIds = await Promise.all(
            examIds.map((id: string) => this.questionRepository.findByExamId(id))
        );
        const examQuestionsMap = new Map<string, any[]>();
        const allQIds = new Set<string>();
        for (let i = 0; i < examIds.length; i++) {
            examQuestionsMap.set(examIds[i], allQuestionIds[i]);
            for (const q of allQuestionIds[i]) allQIds.add(q.id);
        }

        const correctChoiceMap = await this.choiceRepository.findCorrectChoiceIds([...allQIds]);

        const results = [];
        for (const attempt of attempts) {
            const exam = examsMap.get(attempt.exam_id);
            const questions = examQuestionsMap.get(attempt.exam_id) || [];
            const answers = await this.answerRepository.findByAttemptId(attempt.id);

            const correction = questions.map((question: any) => {
                const answer = answers.find((a: any) => a.question_id === question.id);
                const correctChoiceId = correctChoiceMap.get(question.id) ?? null;
                const studentChoiceId = answer?.choice_id ?? null;
                const isCorrect = studentChoiceId !== null && studentChoiceId === correctChoiceId;
                return {
                    questionId: question.id,
                    questionText: question.statement,
                    chosenChoiceId: studentChoiceId,
                    correctChoiceId,
                    isCorrect,
                    pointsEarned: isCorrect ? question.points : 0,
                    pointsPossible: question.points
                };
            });

            results.push({
                id: attempt.id,
                studentId: attempt.student_id,
                examId: attempt.exam_id,
                examTitle: exam?.title ?? "",
                score: attempt.score,
                maxScore: questions.reduce((sum: number, q: any) => sum + Number(q.points), 0),
                submittedAt: attempt.submitted_at,
                corrections: correction
            });
        }
        return results;
    }

    async getExamResults(examId: string) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw createApiError("Examen introuvable", StatusCodes.NOT_FOUND);
        }

        const questions = await this.questionRepository.findByExamId(examId);
        const totalPoints = questions.reduce((sum: number, q: any) => sum + Number(q.points), 0);

        const attempts = await this.attemptRepository.findByExamId(examId);
        const totalAttempts = attempts.length;
        const average = totalAttempts === 0
            ? 0
            : attempts.reduce((sum: number, a: any) => sum + Number(a.score), 0) / totalAttempts;

        const studentIds = [...new Set(attempts.map((a: any) => a.student_id))];
        const students = await userRepository.findByIds(studentIds);
        const studentsMap = new Map(students.map((s: any) => [s.id, s]));

        const results = attempts.map((a: any) => {
            const student = studentsMap.get(a.student_id);
            return {
                studentId: a.student_id,
                firstName: student?.firstName ?? "",
                lastName: student?.lastName ?? "",
                score: a.score,
                submittedAt: a.submitted_at
            };
        });

        return {
            examId,
            totalAttempts,
            totalPoints,
            average,
            results
        };
    }
}
