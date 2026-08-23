import pool from '../config/database';
import {Question, CreateQuestion, UpdateQuestion} from "../models/questionModel";

export class QuestionRepository {
    async findByExamId(examid: string) {
        const result = await pool.query('SELECT * FROM questions WHERE exam_id = $1', [examid]);
        return result.rows;

    }

    async findById(id: string) {
        const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    async createWithChoices(examId: string, data: CreateQuestion): Promise<Question> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const questionResult = await client.query<Question>(
                'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
                [examId, data.statement, data.points]
            );
            const question = questionResult.rows[0];

            for (const choice of data.choices) {
                await client.query(
                    'INSERT INTO choices (question_id,label, is_correct) VALUES ($1, $2, $3)',
                    [question.id, choice.label, choice.isCorrect]
                );
            }

            await client.query('COMMIT');
            return question;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async updateWithChoices(id: string, data: UpdateQuestion): Promise<Question | null> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const questionResult = await client.query<Question>(
                'UPDATE questions SET statement = $1, points = $2 WHERE id = $3 RETURNING *',
                [data.statement, data.points, id]
            );

            if (questionResult.rows.length == 0) {
                await client.query('ROLLBACK');
                return null;
            }

            await client.query('DELETE FROM choices WHERE question_id = $1', [id]);

            for (const choice of data.choices) {
                await client.query(
                    'INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3)',
                    [id, choice.label, choice.isCorrect]
                );
            }

            await client.query('COMMIT');
            return questionResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }


    async delete(id: string) {
        const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }


}
