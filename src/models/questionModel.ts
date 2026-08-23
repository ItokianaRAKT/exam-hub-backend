import {CreateChoice} from "./choiceModel";

export interface Question {
    id: string;
    examId: string;
    text: string;
    points: number;
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


