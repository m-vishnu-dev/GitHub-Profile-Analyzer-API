const express = require('express');
const router = express.Router();
const { analyzeProfile, getProfilesList, getSingleProfile } = require('../controllers/githubController');
const { protect } = require('../middlewares/authMiddleware');

// All github routes require authentication
router.use(protect);

router.post('/analyze', analyzeProfile);
router.get('/profiles', getProfilesList);
router.get('/profiles/:username', getSingleProfile);

module.exports = router;
