import pool from '../config/database';
import {Attempt, CreateAttempt} from "../models/attemptModel";

export class AttemptRepository {

    existsByExamAndStudent = async (examId: string, studentId: string): Promise<boolean> => {
        const result = await pool.query(
            'SELECT EXISTS(SELECT 1 FROM attempts WHERE exam_id = $1 AND student_id = $2) AS exists',
            [examId, studentId]
        );
        return result.rows[0].exists;
    }

    findByExamAndStudent = async (examId: string, studentId: string) => {
        const result = await pool.query(
            'SELECT * FROM attempts WHERE exam_id = $1 AND student_id = $2',
            [examId, studentId]
        );
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    findByStudentId = async (studentId: string) => {
        const result = await pool.query('SELECT * FROM attempts WHERE student_id = $1', [studentId]);
        return result.rows;
    }

    findByExamId = async (examId: string) => {
        const result = await pool.query('SELECT * FROM attempts WHERE exam_id = $1', [examId]);
        return result.rows;
    }

    createWithAnswers = async (data: CreateAttempt, score: number): Promise<Attempt> => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const existsResult = await client.query(
                'SELECT EXISTS(SELECT 1 FROM attempts WHERE exam_id = $1 AND student_id = $2) AS exists',
                [data.examId, data.studentId]
            );
            if (existsResult.rows[0].exists) {
                await client.query('ROLLBACK');
                throw Object.assign(new Error("Vous avez déjà passé cet examen"), { statusCode: 409 });
            }

            const attemptResult = await client.query<Attempt>(
                `INSERT INTO attempts (exam_id, student_id, score, submitted_at)
                 VALUES ($1, $2, $3, NOW()) RETURNING *`,
                [data.examId, data.studentId, score]
            );
            const attempt = attemptResult.rows[0];

            for (const answer of data.answers) {
                await client.query(
                    'INSERT INTO answers (attempt_id, question_id, choice_id) VALUES ($1, $2, $3)',
                    [attempt.id, answer.questionId, answer.choiceId]
                );
            }

            await client.query('COMMIT');
            return attempt;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
