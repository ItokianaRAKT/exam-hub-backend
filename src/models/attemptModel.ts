import {CreateAnswer} from "./answerModel";

export interface Attempt {
    id: string;
    examId: string;
    studentId: string;
    submittedAt: Date;
    score: number;
}

export interface CreateAttempt {
    examId: string;
    studentId: string;
    answers: CreateAnswer[];
}