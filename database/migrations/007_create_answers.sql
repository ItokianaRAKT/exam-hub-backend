CREATE TABLE answers (
                         id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         attempt_id   UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
                         question_id  UUID NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
                         choice_id    UUID,
                         UNIQUE (attempt_id, question_id),
                         FOREIGN KEY (question_id, choice_id) REFERENCES choices(question_id, id)

);

