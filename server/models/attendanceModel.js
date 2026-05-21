const pool = require('../db/pool');

module.exports.listByUser = async (user_id) => {
  const query = `
    SELECT ar.*, c.name AS class_name, c.instructor
    FROM attendance_records ar
    JOIN classes c ON ar.class_id = c.class_id
    WHERE ar.user_id = $1
    ORDER BY ar.date DESC, ar.record_id DESC
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

module.exports.listByClass = async (class_id, user_id) => {
  const query = `
    SELECT ar.*, c.name AS class_name, c.instructor
    FROM attendance_records ar
    JOIN classes c ON ar.class_id = c.class_id
    WHERE ar.class_id = $1 AND ar.user_id = $2
    ORDER BY ar.date DESC
  `;
  const { rows } = await pool.query(query, [class_id, user_id]);
  return rows;
};

module.exports.find = async (record_id) => {
  const query = 'SELECT * FROM attendance_records WHERE record_id = $1';
  const { rows } = await pool.query(query, [record_id]);
  return rows[0] || null;
};

module.exports.create = async (class_id, date, status, notes, user_id) => {
  const query = `
    INSERT INTO attendance_records (class_id, date, status, notes, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [class_id, date, status, notes || null, user_id]);
  return rows[0];
};

module.exports.update = async (record_id, { status, notes }) => {
  const query = `
    UPDATE attendance_records
    SET status = $1, notes = $2
    WHERE record_id = $3
    RETURNING *
  `;
  const { rows } = await pool.query(query, [status, notes || null, record_id]);
  return rows[0];
};

module.exports.destroy = async (record_id) => {
  const query = 'DELETE FROM attendance_records WHERE record_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [record_id]);
  return rows[0] || null;
};

module.exports.statsByUser = async (user_id) => {
  const query = `
    SELECT
      c.class_id,
      c.name AS class_name,
      c.instructor,
      COUNT(*) FILTER (WHERE ar.status = 'present') AS present_count,
      COUNT(*) FILTER (WHERE ar.status = 'absent')  AS absent_count,
      COUNT(*) FILTER (WHERE ar.status = 'late')    AS late_count,
      COUNT(*) FILTER (WHERE ar.status = 'excused') AS excused_count,
      COUNT(*) AS total_count
    FROM classes c
    LEFT JOIN attendance_records ar ON ar.class_id = c.class_id AND ar.user_id = $1
    WHERE c.user_id = $1
    GROUP BY c.class_id, c.name, c.instructor
    ORDER BY c.class_id ASC
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};
