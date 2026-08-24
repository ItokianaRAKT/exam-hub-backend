CREATE TABLE exams (
                       id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
                       title       VARCHAR(200) NOT NULL,
                       description TEXT,
                       starts_at   TIMESTAMPTZ NOT NULL,
                       ends_at     TIMESTAMPTZ NOT NULL,
                       created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                       CONSTRAINT exams_dates_check CHECK (ends_at > starts_at)
);
