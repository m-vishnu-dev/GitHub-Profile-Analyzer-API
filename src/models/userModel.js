const pool = require('../config/db');

const createUser = async (email, passwordHash) => {
  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
