import pool from "../config/database";
import { Course } from "../models/courseModel";

export class CourseRepository {
  async findAll(): Promise<Course[]> {
    const result = await pool.query(
      `SELECT id, code, name, description
       FROM courses
       ORDER BY code`
    );
    return result.rows;
  }

  async findById(id: number): Promise<Course | null> {
    const result = await pool.query(
      `SELECT id, code, name, description
       FROM courses
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByCode(code: string): Promise<Course | null> {
    const result = await pool.query(
      `SELECT id, code, name, description
       FROM courses
       WHERE code = $1`,
      [code]
    );
    return result.rows[0] || null;
  }

  async create(data: {
    code: string;
    name: string;
    description: string | null;
  }): Promise<Course> {
    const result = await pool.query(
      `INSERT INTO courses (code, name, description)
       VALUES ($1, $2, $3)
       RETURNING id, code, name, description`,
      [data.code, data.name, data.description]
    );
    return result.rows[0];
  }

  async update(
    id: number,
    data: { code: string; name: string; description: string | null }
  ): Promise<Course | null> {
    const result = await pool.query(
      `UPDATE courses
       SET code = $1, name = $2, description = $3
       WHERE id = $4
       RETURNING id, code, name, description`,
      [data.code, data.name, data.description, id]
    );
    return result.rows[0] || null;
  }

  async remove(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM courses WHERE id = $1`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async countExamsByCourse(courseId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM exams
       WHERE course_id = $1`,
      [courseId]
    );
    return result.rows[0].count;
  }
}
