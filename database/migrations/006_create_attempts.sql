CREATE TABLE attempts (
                          id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          exam_id      UUID NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
                          student_id   VARCHAR(20) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
                          submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                          score        NUMERIC NOT NULL DEFAULT 0,
                          UNIQUE (exam_id, student_id)
);

