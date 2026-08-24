CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE courses (
                         id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         code        VARCHAR(20) NOT NULL UNIQUE,
                         name        VARCHAR(150) NOT NULL,
                         description TEXT
);
