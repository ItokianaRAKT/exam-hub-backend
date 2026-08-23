export interface Choice {
    id: string;
    questionId: string;
    label: string;
    isCorrect: boolean;
}

export interface CreateChoice {
    label: string;
    isCorrect: boolean;
}

