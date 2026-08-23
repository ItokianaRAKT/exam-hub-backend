import pool from "../config/database";
import { User } from "../models/userModel";

export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, password_hash AS "passwordHash", is_active AS "isActive",
            created_at AS "createdAt"
     FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return result.rows[0] || null;
}
