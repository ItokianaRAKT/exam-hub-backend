import pool from '../config/database';
import {Choice} from "../models/choiceModel";

export class ChoiceRepository {

    findByQuestionId = async (questionId: string) => {
        const result = await pool.query('SELECT * FROM choices WHERE question_id = $1', [questionId]);
        return result.rows;
    }

    findById = async (id: string) => {
        const result = await pool.query('SELECT * FROM choices WHERE id = $1', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    findCorrectChoiceId = async (questionId: string) => {
        const result = await pool.query(
            'SELECT id FROM choices WHERE question_id = $1 AND is_correct = true',
            [questionId]
        );
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0].id;
    }
}
