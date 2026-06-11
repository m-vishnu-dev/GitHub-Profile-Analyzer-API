const pool = require('../config/db');

const saveProfile = async (profileData) => {
  const {
    login,
    name,
    bio,
    public_repos,
    followers,
    following,
    avatar_url,
    total_stars,
    total_forks,
    account_age_years,
    top_languages
  } = profileData;

  // Insert or update (upsert)
  const query = `
    INSERT INTO analyzed_profiles 
    (username, name, bio, public_repos, followers, following, avatar_url, total_stars, total_forks, account_age_years, top_languages) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    name = VALUES(name), bio = VALUES(bio), public_repos = VALUES(public_repos), 
    followers = VALUES(followers), following = VALUES(following), 
    avatar_url = VALUES(avatar_url), total_stars = VALUES(total_stars), total_forks = VALUES(total_forks),
    account_age_years = VALUES(account_age_years), top_languages = VALUES(top_languages), updated_at = CURRENT_TIMESTAMP
  `;

  const [result] = await pool.execute(query, [
    login,
    name,
    bio,
    public_repos,
    followers,
    following,
    avatar_url,
    total_stars || 0,
    total_forks || 0,
    account_age_years || 0.00,
    JSON.stringify(top_languages || [])
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
