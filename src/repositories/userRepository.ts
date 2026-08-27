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

export async function create(data: {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (role, first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
               email, is_active AS "isActive", created_at AS "createdAt"`,
    [data.role, data.firstName, data.lastName, data.email, data.passwordHash]
  );
  return result.rows[0];
}

export async function update(
  id: number,
  data: { email: string }
): Promise<User | null> {
  const result = await pool.query(
    `UPDATE users
     SET email = $1
     WHERE id = $2
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
               email, is_active AS "isActive", created_at AS "createdAt"`,
    [data.email, id]
  );
  return result.rows[0] || null;
}

export async function updatePassword(id: number, passwordHash: string): Promise<void> {
  await pool.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [passwordHash, id]
  );
}

export async function setActive(id: number, isActive: boolean): Promise<User | null> {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $1
     WHERE id = $2
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
               email, is_active AS "isActive", created_at AS "createdAt"`,
    [isActive, id]
  );
  return result.rows[0] || null;
}
