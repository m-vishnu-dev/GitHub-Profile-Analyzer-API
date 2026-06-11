const { fetchGitHubProfile, fetchGitHubRepos } = require('../services/githubService');
const { saveProfile, getAllProfiles, getProfileByUsername } = require('../models/profileModel');

const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username is required'
      });
    }

    // Fetch from GitHub
    const githubData = await fetchGitHubProfile(username);
    const reposData = await fetchGitHubRepos(username);

    // Compute metrics
    const total_stars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const total_forks = reposData.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
    
    const ageMs = new Date() - new Date(githubData.created_at);
    const account_age_years = Number((ageMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2));

    const langCounts = {};
    reposData.forEach(repo => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });
    const top_languages = Object.entries(langCounts)
      .map(([language_name, repo_count]) => ({ language_name, repo_count }))
      .sort((a, b) => b.repo_count - a.repo_count);

    const fullProfileData = {
      ...githubData,
      total_stars,
      total_forks,
      account_age_years,
      top_languages
    };

    // Save/Update in DB
    await saveProfile(fullProfileData);

    // Fetch the updated profile from DB to return
    const savedProfile = await getProfileByUsername(githubData.login);

    const languages = {};
    top_languages.forEach(item => {
      languages[item.language_name] = item.repo_count;
    });

    res.status(200).json({
      success: true,
      message: 'Profile analyzed and stored successfully.',
      data: {
        github_username: savedProfile.username,
        insights: {
          total_stars: savedProfile.total_stars,
          total_forks: savedProfile.total_forks,
          account_age_years: Number(savedProfile.account_age_years)
        },
        languages
      }
    });
  } catch (error) {
    if (error.message === 'GitHub profile not found') {
      return res.status(404).json({
        success: false,
        message: 'GitHub profile not found'
      });
    }
    next(error);
  }
};

const getProfilesList = async (req, res, next) => {
  try {
    const profiles = await getAllProfiles();
    const formattedProfiles = profiles.map(p => ({
      github_username: p.username,
      full_name: p.name,
      public_repos: p.public_repos,
      total_stars: p.total_stars,
      updated_at: p.updated_at
    }));

    res.status(200).json({
      success: true,
      count: formattedProfiles.length,
      data: formattedProfiles
    });
  } catch (error) {
    next(error);
  }
};

const getSingleProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsername(username);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found in database'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        github_username: profile.username,
        full_name: profile.name,
        bio: profile.bio,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        total_stars: profile.total_stars,
        total_forks: profile.total_forks,
        account_age_years: Number(profile.account_age_years),
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        top_languages: typeof profile.top_languages === 'string'
          ? JSON.parse(profile.top_languages)
          : (profile.top_languages || [])
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeProfile,
  getProfilesList,
  getSingleProfile
};
