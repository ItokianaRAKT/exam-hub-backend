CREATE TYPE user_role AS ENUM ('admin', 'student');

CREATE TABLE users (
                       id            VARCHAR(20) PRIMARY KEY,
                       role          user_role NOT NULL,
                       first_name    VARCHAR(100) NOT NULL,
                       last_name     VARCHAR(100) NOT NULL,
                       email         VARCHAR(255) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       is_active     BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_unique ON users (LOWER(email));

CREATE SEQUENCE student_id_seq START 1;