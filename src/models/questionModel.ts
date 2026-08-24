import {CreateChoice, ChoiceInput} from "./choiceModel";

export interface Question {
    id: string;
    examId: string;
    statement: string;
    points: number;
    position: number;
}

export interface CreateQuestion {
    statement: string;
    points: number;
    choices: CreateChoice[];
}

export interface UpdateQuestion {
    statement: string;
    points: number;
    choices: CreateChoice[];
}

export interface QuestionInput {
    statement: string;
    points: number;
    choices: ChoiceInput[];
}
