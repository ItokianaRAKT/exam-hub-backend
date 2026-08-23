import pool from '../config/database';
import {ExamModel, CreateExam, UpdateExam} from "../models/examModel";

export class ExamRepository {

    async findAll(courseId?: string) {
        if (courseId) {
            const result = await pool.query('SELECT * FROM exams WHERE course_id = $1', [courseId]);
            return result.rows;
        }
        const result = await pool.query('SELECT * FROM exams');
        return result.rows;
    }

    async findById(id: string) {
        const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    async create(data: CreateExam): Promise<ExamModel> {
        const result = await pool.query<ExamModel>(
            'INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [data.courseId, data.title, data.description, data.startAt, data.endAt]
        );
        return result.rows[0];
    }

    async update(id: string, data: UpdateExam): Promise<ExamModel | null> {
        const result = await pool.query<ExamModel>(
            'UPDATE exams SET title = $1, description = $2, starts_at = $3, ends_at = $4 WHERE id = $5 RETURNING *',
            [data.title, data.description, data.startAt, data.endAt, id]
        );
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    async delete(id: string) {
        const result = await pool.query('DELETE FROM exams WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    async hasAttempts(examId: string): Promise<boolean> {
        const result = await pool.query('SELECT EXISTS(SELECT 1 FROM attempts WHERE exam_id = $1) AS exists', [examId]);
        return result.rows[0].exists;
    }
}
