import pool from '../config/database';
import {ExamModel, CreateExam, UpdateExam} from "../models/examModel";

export class ExamRepository {

    findAll = async (courseId?: string) => {
        if (courseId) {
            const result = await pool.query(
                `SELECT e.*,
                        c.code AS course_code, c.name AS course_name, c.description AS course_description,
                        (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                        (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                        (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
                 FROM exams e
                 LEFT JOIN courses c ON c.id = e.course_id
                 WHERE e.course_id = $1`,
                [courseId]
            );
            return result.rows;
        }
        const result = await pool.query(
            `SELECT e.*,
                    c.code AS course_code, c.name AS course_name, c.description AS course_description,
                    (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                    (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                    (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
             FROM exams e
             LEFT JOIN courses c ON c.id = e.course_id`
        );
        return result.rows;
    }

    findById = async (id: string) => {
        const result = await pool.query('SELECT * FROM exams WHERE id = $1', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    create = async (data: CreateExam): Promise<ExamModel> => {
        const result = await pool.query<ExamModel>(
            'INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [data.courseId, data.title, data.description, data.startsAt, data.endsAt]
        );
        return result.rows[0];
    }

    update = async (id: string, data: UpdateExam): Promise<ExamModel | null> => {
        const result = await pool.query<ExamModel>(
            'UPDATE exams SET title = $1, description = $2, starts_at = $3, ends_at = $4 WHERE id = $5 RETURNING *',
            [data.title, data.description, data.startsAt, data.endsAt, id]
        );
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    delete = async (id: string) => {
        const result = await pool.query('DELETE FROM exams WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length == 0) {
            return null;
        }
        return result.rows[0];
    }

    hasAttempts = async (examId: string): Promise<boolean> => {
        const result = await pool.query('SELECT EXISTS(SELECT 1 FROM attempts WHERE exam_id = $1) AS exists', [examId]);
        return result.rows[0].exists;
    }

    findDetailById = async (id: string) => {
        const result = await pool.query(
            `SELECT e.*,
                    c.code AS course_code, c.name AS course_name, c.description AS course_description,
                    (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                    (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                    (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
             FROM exams e
             LEFT JOIN courses c ON c.id = e.course_id
             WHERE e.id = $1`,
            [id]
        );
        if (result.rows.length === 0) return null;
        const exam = result.rows[0];

        const questionsResult = await pool.query(
            `SELECT q.*, 
                    json_agg(
                        json_build_object('id', ch.id, 'text', ch.text, 'isCorrect', ch.is_correct)
                        ORDER BY ch.position
                    ) AS choices
             FROM questions q
             LEFT JOIN choices ch ON ch.question_id = q.id
             WHERE q.exam_id = $1
             GROUP BY q.id
             ORDER BY q.position`,
            [id]
        );

        return { ...exam, questions: questionsResult.rows };
    }

    findAvailableForStudent = async (studentId: string) => {
        const result = await pool.query(
            `SELECT e.*,
                    c.code AS course_code, c.name AS course_name, c.description AS course_description,
                    (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                    (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                    (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
             FROM exams e
             LEFT JOIN courses c ON c.id = e.course_id
             WHERE now() BETWEEN e.starts_at AND e.ends_at
             AND NOT EXISTS (
                 SELECT 1 FROM attempts a
                 WHERE a.exam_id = e.id AND a.student_id = $1
             )
             ORDER BY e.starts_at`,
            [studentId]
        );
        return result.rows;
    }

    findAllUpcoming = async () => {
        const result = await pool.query(
            `SELECT e.*,
                    c.code AS course_code, c.name AS course_name, c.description AS course_description,
                    (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                    (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                    (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
             FROM exams e
             LEFT JOIN courses c ON c.id = e.course_id
             WHERE e.starts_at > now()
             ORDER BY e.starts_at`
        );
        return result.rows;
    }

    findAllClosed = async () => {
        const result = await pool.query(
            `SELECT e.*,
                    c.code AS course_code, c.name AS course_name, c.description AS course_description,
                    (SELECT COUNT(*)::int FROM questions q WHERE q.exam_id = e.id) AS "questionCount",
                    (SELECT COUNT(*)::int FROM attempts a WHERE a.exam_id = e.id) AS "attemptCount",
                    (SELECT COALESCE(SUM(q.points), 0)::int FROM questions q WHERE q.exam_id = e.id) AS "totalPoints"
             FROM exams e
             LEFT JOIN courses c ON c.id = e.course_id
             WHERE e.ends_at < now()
             ORDER BY e.starts_at`
        );
        return result.rows;
    }
}
