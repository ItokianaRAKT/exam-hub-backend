import pool from '../config/database';
import {Question, CreateQuestion, UpdateQuestion} from "../models/questionModel";

export class QuestionRepository {
    findByExamId = async (examid: string) => {
        const result = await pool.query('SELECT * FROM questions WHERE exam_id = $1', [examid]);
        return result.rows;
    }

    findById = async (id: string) => {
        const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    createWithChoices = async (examId: string, data: CreateQuestion): Promise<Question> => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const countResult = await client.query(
                'SELECT COUNT(*) FROM questions WHERE exam_id = $1',
                [examId]
            );
            const position = parseInt(countResult.rows[0].count, 10) + 1;

            const questionResult = await client.query<Question>(
                'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING *',
                [examId, data.statement, data.points]
            );
            const question = questionResult.rows[0];

            let choicePosition = 1;
            for (const choice of data.choices) {
                await client.query(
                    'INSERT INTO choices (question_id, text, is_correct, position) VALUES ($1, $2, $3, $4)',
                    [question.id, choice.text, choice.isCorrect, choicePosition]
                );
                choicePosition++;
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

    updateWithChoices = async (id: string, data: UpdateQuestion): Promise<Question | null> => {
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

            let position = 1;
            for (const choice of data.choices) {
                await client.query(
                    'INSERT INTO choices (question_id, text, is_correct, position) VALUES ($1, $2, $3, $4)',
                    [id, choice.text, choice.isCorrect, position]
                );
                position++;
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

    delete = async (id: string) => {
        const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }
}
