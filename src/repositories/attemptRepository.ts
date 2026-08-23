import pool from "../config/database";

export async function countByExam(examId: number): Promise<number> {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM attempts
     WHERE exam_id = $1`,
    [examId]
  );
  return result.rows[0].count;
}
