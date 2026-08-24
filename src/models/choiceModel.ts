export interface Choice {
    id: string;
    questionId: string;
    label: string;
    isCorrect: boolean;
    position: number;
}

export interface CreateChoice {
    label: string;
    isCorrect: boolean;
}


export interface ChoiceInput {
    label: string;
    isCorrect: boolean;
}
