CREATE TABLE questions (
                           id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           exam_id   UUID NOT NULL REFERENCES exams(id) ON DELETE RESTRICT,
                           statement TEXT NOT NULL,
                           points    NUMERIC NOT NULL CHECK (points > 0),
                           position  INTEGER NOT NULL CHECK (position > 0),
                           UNIQUE (exam_id, position)
);
