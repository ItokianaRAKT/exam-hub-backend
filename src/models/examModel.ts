export interface ExamModel {
    id: string;
    courseId: string;
    title: string;
    description: string;
    startsAt: Date,
    endsAt: Date;
}

export interface CreateExam {
    courseId: string;
    title: string;
    description: string;
    startsAt: Date,
    endsAt: Date;
}

export interface UpdateExam {
    courseId: string;
    title: string;
    description: string;
    startsAt: Date;
    endsAt: Date;
}
