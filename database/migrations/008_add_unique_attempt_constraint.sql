ALTER TABLE attempts ADD CONSTRAINT attempts_exam_id_student_id_unique UNIQUE (exam_id, student_id);
