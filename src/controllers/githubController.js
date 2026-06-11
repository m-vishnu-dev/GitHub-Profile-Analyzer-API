const { fetchGitHubProfile } = require('../services/githubService');
const { saveProfile, getAllProfiles, getProfileByUsername } = require('../models/profileModel');

const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'GitHub username is required' });
    }

    // Fetch from GitHub
    const githubData = await fetchGitHubProfile(username);

    // Save/Update in DB
    await saveProfile(githubData, req.user.id);

    // Fetch the updated profile from DB to return
    const savedProfile = await getProfileByUsername(githubData.login);

    res.status(200).json({
      message: 'Profile analyzed and saved successfully',
      profile: savedProfile
    });
  } catch (error) {
    next(error);
  }
};

const getProfilesList = async (req, res, next) => {
  try {
    const profiles = await getAllProfiles();
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
};

const getSingleProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsername(username);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found in database' });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeProfile,
  getProfilesList,
  getSingleProfile
};
