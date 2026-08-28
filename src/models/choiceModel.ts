export interface Choice {
    id: string;
    questionId: string;
    text: string;
    isCorrect: boolean;
    position: number;
}

export interface CreateChoice {
    text: string;
    isCorrect: boolean;
}


export interface ChoiceInput {
    text: string;
    isCorrect: boolean;
}
