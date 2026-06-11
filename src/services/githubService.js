const axios = require('axios');

const fetchGitHubProfile = async (username) => {
  try {
    const response = await axios.get(`${process.env.GITHUB_API_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('GitHub profile not found');
    }
    throw new Error('Error fetching data from GitHub');
  }
};

module.exports = {
  fetchGitHubProfile
};
