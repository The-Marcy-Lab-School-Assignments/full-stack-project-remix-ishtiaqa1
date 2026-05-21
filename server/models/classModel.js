const pool = require('../db/pool');

module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM classes WHERE user_id = $1 ORDER BY class_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

module.exports.find = async (class_id) => {
  const query = 'SELECT * FROM classes WHERE class_id = $1';
  const { rows } = await pool.query(query, [class_id]);
  return rows[0] || null;
};

module.exports.create = async (name, instructor, user_id) => {
  const query = 'INSERT INTO classes (name, instructor, user_id) VALUES ($1, $2, $3) RETURNING *';
  const { rows } = await pool.query(query, [name, instructor, user_id]);
  return rows[0];
};

module.exports.update = async (class_id, { name, instructor }) => {
  const query = 'UPDATE classes SET name = $1, instructor = $2 WHERE class_id = $3 RETURNING *';
  const { rows } = await pool.query(query, [name, instructor, class_id]);
  return rows[0];
};

module.exports.destroy = async (class_id) => {
  const query = 'DELETE FROM classes WHERE class_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [class_id]);
  return rows[0] || null;
};
