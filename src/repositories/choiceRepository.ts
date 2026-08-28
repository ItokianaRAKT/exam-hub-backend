import pool from '../config/database';
import {Choice} from "../models/choiceModel";

export class ChoiceRepository {

    findByQuestionId = async (questionId: string) => {
        const result = await pool.query('SELECT * FROM choices WHERE question_id = $1', [questionId]);
        return result.rows;
    }

    findByQuestionIds = async (questionIds: string[]) => {
        if (questionIds.length === 0) return [];
        const result = await pool.query(
            'SELECT * FROM choices WHERE question_id = ANY($1)',
            [questionIds]
        );
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

    findCorrectChoiceIds = async (questionIds: string[]) => {
        if (questionIds.length === 0) return new Map();
        const result = await pool.query(
            'SELECT id, question_id FROM choices WHERE question_id = ANY($1) AND is_correct = true',
            [questionIds]
        );
        const map = new Map<string, string>();
        for (const row of result.rows) {
            map.set(row.question_id, row.id);
        }
        return map;
    }
}
