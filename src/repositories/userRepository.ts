import pool from "../config/database";
import { User } from "../models/userModel";

export async function findAll(role?: string): Promise<User[]> {
  if (role) {
    const result = await pool.query(
      `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
              email, is_active AS "isActive", created_at AS "createdAt"
       FROM users
       WHERE role = $1
       ORDER BY created_at DESC`,
      [role]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, is_active AS "isActive", created_at AS "createdAt"
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function findById(id: number): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, is_active AS "isActive", created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

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
