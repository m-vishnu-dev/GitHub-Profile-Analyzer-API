const pool = require('../config/db');

const saveProfile = async (profileData, userId) => {
  const {
    login,
    name,
    bio,
    public_repos,
    followers,
    following,
    avatar_url
  } = profileData;

  // Insert or update (upsert)
  const query = `
    INSERT INTO analyzed_profiles 
    (username, name, bio, public_repos, followers, following, avatar_url, analyzed_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    name = VALUES(name), bio = VALUES(bio), public_repos = VALUES(public_repos), 
    followers = VALUES(followers), following = VALUES(following), 
    avatar_url = VALUES(avatar_url), analyzed_by = VALUES(analyzed_by), updated_at = CURRENT_TIMESTAMP
  `;

  const [result] = await pool.execute(query, [
    login, name, bio, public_repos, followers, following, avatar_url, userId
  ]);

  return result;
};

const getAllProfiles = async () => {
  const [rows] = await pool.execute('SELECT * FROM analyzed_profiles ORDER BY updated_at DESC');
  return rows;
};

const getProfileByUsername = async (username) => {
  const [rows] = await pool.execute('SELECT * FROM analyzed_profiles WHERE username = ?', [username]);
  return rows[0];
};

module.exports = {
  saveProfile,
  getAllProfiles,
  getProfileByUsername
};
