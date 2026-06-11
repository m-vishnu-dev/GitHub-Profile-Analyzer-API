const axios = require('axios');

const fetchGitHubProfile = async (username) => {
  try {
    const headers = { 'User-Agent': 'GitHub-Profile-Analyzer-API' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const response = await axios.get(`${process.env.GITHUB_API_URL || 'https://api.github.com'}/users/${username}`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error in fetchGitHubProfile:', error.message, error.response ? error.response.data : '');
    if (error.response && error.response.status === 404) {
      throw new Error('GitHub profile not found');
    }
    throw new Error('Error fetching data from GitHub');
  }
};

const fetchGitHubRepos = async (username) => {
  try {
    const headers = { 'User-Agent': 'GitHub-Profile-Analyzer-API' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const response = await axios.get(`${process.env.GITHUB_API_URL || 'https://api.github.com'}/users/${username}/repos?per_page=100`, { headers });
    return response.data;
  } catch (error) {
    console.error('Error in fetchGitHubRepos:', error.message, error.response ? error.response.data : '');
    throw new Error('Error fetching repositories from GitHub');
  }
};

module.exports = {
  fetchGitHubProfile,
  fetchGitHubRepos
};
