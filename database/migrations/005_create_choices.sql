CREATE TABLE choices (
                         id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                         text        VARCHAR(500) NOT NULL,
                         is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
                         position    INTEGER NOT NULL CHECK (position > 0),
                         UNIQUE (question_id, position),
                         UNIQUE (id, question_id)
);

