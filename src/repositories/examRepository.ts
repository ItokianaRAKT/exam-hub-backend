import pool from "../config/database";
import { Exam } from "../models/examModel";

export async function findAll(courseId?: number): Promise<Exam[]> {
  if (courseId) {
    const result = await pool.query(
      `SELECT id, course_id AS "courseId", title, description,
              starts_at AS "startsAt", ends_at AS "endsAt", created_at AS "createdAt"
       FROM exams
       WHERE course_id = $1
       ORDER BY starts_at DESC`,
      [courseId]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT id, course_id AS "courseId", title, description,
            starts_at AS "startsAt", ends_at AS "endsAt", created_at AS "createdAt"
     FROM exams
     ORDER BY starts_at DESC`
  );
  return result.rows;
}

export async function findById(id: number): Promise<Exam | null> {
  const result = await pool.query(
    `SELECT id, course_id AS "courseId", title, description,
            starts_at AS "startsAt", ends_at AS "endsAt", created_at AS "createdAt"
     FROM exams
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function create(
  courseId: number,
  title: string,
  description: string | null,
  startsAt: string,
  endsAt: string
): Promise<Exam> {
  const result = await pool.query(
    `INSERT INTO exams (course_id, title, description, starts_at, ends_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, course_id AS "courseId", title, description,
               starts_at AS "startsAt", ends_at AS "endsAt", created_at AS "createdAt"`,
    [courseId, title, description, startsAt, endsAt]
  );
  return result.rows[0];
}

export async function update(
  id: number,
  courseId: number,
  title: string,
  description: string | null,
  startsAt: string,
  endsAt: string
): Promise<Exam | null> {
  const result = await pool.query(
    `UPDATE exams
     SET course_id = $1, title = $2, description = $3, starts_at = $4, ends_at = $5
     WHERE id = $6
     RETURNING id, course_id AS "courseId", title, description,
               starts_at AS "startsAt", ends_at AS "endsAt", created_at AS "createdAt"`,
    [courseId, title, description, startsAt, endsAt, id]
  );
  return result.rows[0] || null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM exams WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
