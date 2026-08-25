import { ExamRepository } from '../repositories/examRepository';
import { QuestionRepository } from '../repositories/questionRepository';
import { ChoiceRepository } from '../repositories/choiceRepository';
import { AttemptRepository } from '../repositories/attemptRepository';
import { StatusCodes } from 'http-status-codes';

export class StudentExamService {
    private examRepository: ExamRepository;
    private questionRepository: QuestionRepository;
    private choiceRepository: ChoiceRepository;
    private attemptRepository: AttemptRepository;

    constructor(
        examRepository: ExamRepository,
        questionRepository: QuestionRepository,
        choiceRepository: ChoiceRepository,
        attemptRepository: AttemptRepository
    ) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.choiceRepository = choiceRepository;
        this.attemptRepository = attemptRepository;
    }


    async getAvailableExams(studentId: string) {
        return this.examRepository.findAvailableForStudent(studentId);
    }


    async getExamForStudent(examId: string, studentId: string) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
            throw Object.assign(new Error("Exam not found"), { status: StatusCodes.NOT_FOUND });
        }

        const now = new Date();
        if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
            throw Object.assign(new Error("This exam is not available."), { status: StatusCodes.FORBIDDEN });
        }

        const alreadyAttempted = await this.attemptRepository.existsByExamAndStudent(examId, studentId);
        if (alreadyAttempted) {
            throw Object.assign(new Error("You already passed this exam."), { status: StatusCodes.FORBIDDEN });
        }

        const questions = await this.questionRepository.findByExamId(examId);

        const questionsForStudent = [];
        for (const question of questions) {
            const choices = await this.choiceRepository.findByQuestionId(question.id);

            const choicesForStudent = choices.map((c: any) => ({
                id: c.id,
                text: c.text,
                position: c.position
            }));

            questionsForStudent.push({
                id: question.id,
                statement: question.statement,
                points: question.points,
                position: question.position,
                choices: choicesForStudent
            });
        }

        return {
            id: exam.id,
            title: exam.title,
            description: exam.description,
            startsAt: exam.starts_at,
            endsAt: exam.ends_at,
            questions: questionsForStudent
        };
    }
}