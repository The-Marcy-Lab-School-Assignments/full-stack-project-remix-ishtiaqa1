const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS attendance_records');
  await pool.query('DROP TABLE IF EXISTS classes');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE classes (
      class_id    SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      instructor  TEXT NOT NULL,
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE attendance_records (
      record_id   SERIAL PRIMARY KEY,
      class_id    INT REFERENCES classes(class_id) ON DELETE CASCADE,
      date        DATE NOT NULL,
      status      TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
      notes       TEXT,
      user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  const { rows: aliceClasses } = await pool.query(`
    INSERT INTO classes (name, instructor, user_id) VALUES
      ('Intro to Computer Science', 'Prof. Williams', $1),
      ('Calculus II',               'Prof. Chen',     $1),
      ('English Composition',       'Prof. Rivera',   $1)
    RETURNING class_id
  `, [alice.user_id]);

  const { rows: bobClasses } = await pool.query(`
    INSERT INTO classes (name, instructor, user_id) VALUES
      ('Data Structures', 'Prof. Patel', $1),
      ('Linear Algebra',  'Prof. Kim',   $1)
    RETURNING class_id
  `, [bob.user_id]);

  await pool.query(`
    INSERT INTO attendance_records (class_id, date, status, notes, user_id) VALUES
      ($1, '2025-01-13', 'present', NULL,                      $4),
      ($1, '2025-01-15', 'present', NULL,                      $4),
      ($1, '2025-01-20', 'late',    'Bus was delayed',         $4),
      ($2, '2025-01-14', 'present', NULL,                      $4),
      ($2, '2025-01-21', 'absent',  'Doctor appointment',      $4),
      ($3, '2025-01-13', 'present', NULL,                      $4),
      ($3, '2025-01-15', 'excused', 'College event',           $4)
  `, [aliceClasses[0].class_id, aliceClasses[1].class_id, aliceClasses[2].class_id, alice.user_id]);

  await pool.query(`
    INSERT INTO attendance_records (class_id, date, status, notes, user_id) VALUES
      ($1, '2025-01-13', 'present', NULL,                      $3),
      ($1, '2025-01-15', 'absent',  'Sick',                    $3),
      ($2, '2025-01-14', 'present', NULL,                      $3),
      ($2, '2025-01-16', 'late',    'Traffic',                 $3)
  `, [bobClasses[0].class_id, bobClasses[1].class_id, bob.user_id]);

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
