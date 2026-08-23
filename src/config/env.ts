import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/dbname",
  DATABASE_NAME: process.env.DATABASE_NAME || "dbname",
  DATABASE_USER: process.env.DATABASE_USER || "user",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "password",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  PORT: parseInt(process.env.PORT || "8080", 10),
};
