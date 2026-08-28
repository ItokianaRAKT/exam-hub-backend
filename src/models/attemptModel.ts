import {CreateAnswer} from "./answerModel";

export interface Attempt {
    id: string;
    exam_id: string;
    student_id: string;
    submitted_at: Date;
    score: number;
}

export interface CreateAttempt {
    examId: string;
    studentId: string;
    answers: CreateAnswer[];
}
