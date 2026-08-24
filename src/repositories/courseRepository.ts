import pool from "../config/database";
import { Course } from "../models/courseModel";

export async function findAll(): Promise<Course[]> {
  const result = await pool.query(
    `SELECT id, code, name, description
     FROM courses
     ORDER BY code`
  );
  return result.rows;
}

export async function findById(id: number): Promise<Course | null> {
  const result = await pool.query(
    `SELECT id, code, name, description
     FROM courses
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}
