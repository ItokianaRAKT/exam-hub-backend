import pool from "../config/database";
import { User } from "../models/userModel";

const studentYearLocks = new Map<string, Promise<void>>();

const withStudentYearLock = async <T>(year: string, task: () => Promise<T>): Promise<T> => {
  let release: () => void = () => {};
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const previous = studentYearLocks.get(year) ?? Promise.resolve();
  const chain = previous.then(() => current);
  studentYearLocks.set(year, chain);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (studentYearLocks.get(year) === chain) {
      studentYearLocks.delete(year);
    }
  }
};

const generateStudentId = async (): Promise<string> => {
  const year = String(new Date().getFullYear()).slice(-2);
  return withStudentYearLock(year, async () => {
    const result = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 0) + 1 AS "next_seq"
       FROM users
       WHERE id LIKE $1`,
      [`STD${year}%`]
    );
    const nextSeq = result.rows[0].next_seq;
    return `STD${year}${String(nextSeq).padStart(3, "0")}`;
  });
};

export const findAll = async (role?: string): Promise<User[]> => {
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
};

export const findById = async (id: string): Promise<User | null> => {
  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, is_active AS "isActive", created_at AS "createdAt"
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, password_hash AS "passwordHash", is_active AS "isActive",
            created_at AS "createdAt"
     FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return result.rows[0] || null;
};

export const create = async (data: {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}): Promise<User> => {
  const id = await generateStudentId();
  const result = await pool.query(
    `INSERT INTO users (id, role, first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
               email, is_active AS "isActive", created_at AS "createdAt"`,
    [id, data.role, data.firstName, data.lastName, data.email, data.passwordHash]
  );
  return result.rows[0];
};

export const update = async (
  id: string,
  data: { email: string }
): Promise<User | null> => {
  const result = await pool.query(
    `UPDATE users
     SET email = $1
     WHERE id = $2
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
               email, is_active AS "isActive", created_at AS "createdAt"`,
    [data.email, id]
  );
  return result.rows[0] || null;
};

export const updatePassword = async (id: string, passwordHash: string): Promise<void> => {
  await pool.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [passwordHash, id]
  );
};

export const setActive = async (id: string, isActive: boolean): Promise<User | null> => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $1
     WHERE id = $2
     RETURNING id, role, first_name AS "firstName", last_name AS "lastName",
              email, is_active AS "isActive", created_at AS "createdAt"`,
    [isActive, id]
  );
  return result.rows[0] || null;
};

export const findByIds = async (ids: string[]): Promise<User[]> => {
  if (ids.length === 0) return [];
  const result = await pool.query(
    `SELECT id, role, first_name AS "firstName", last_name AS "lastName",
            email, is_active AS "isActive", created_at AS "createdAt"
     FROM users
     WHERE id = ANY($1)`,
    [ids]
  );
  return result.rows;
};
