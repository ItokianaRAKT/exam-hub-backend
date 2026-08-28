INSERT INTO users (id, role, first_name, last_name, email, password_hash)
VALUES
  ('ADM001', 'admin', 'Admin', 'User', 'admin@example.com', '$2b$10$4Z4VCRWjWj1890sTYbMPGex2AqkkSXvhg9bE3x3OEYwnfw2zuOEA.'),
  ('STU001', 'student', 'Jean', 'Dupont', 'student@example.com', '$2b$10$SMs851kG2EG2i/wc1qo67..QsV2845px4Qu3RhxyJHYhpLRqJ6hO2')
ON CONFLICT (id) DO NOTHING;
