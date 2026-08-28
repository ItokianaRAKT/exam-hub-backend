import pool from '../config/database';
import {Answer} from "../models/answerModel";

export class AnswerRepository {

    findByAttemptId = async (attemptId: string) => {
        const result = await pool.query('SELECT * FROM answers WHERE attempt_id = $1', [attemptId]);
        return result.rows;
    }
}
