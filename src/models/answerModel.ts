export interface Answer {
    id: string;
    attemptId: string;
    questionId: string;
    choiceId: string | null;
}

export interface CreateAnswer {
    questionId: string;
    choiceId: string | null;
}

export interface SubmitAnswerInput {
    questionId: string;
    choiceId: string | null;
}