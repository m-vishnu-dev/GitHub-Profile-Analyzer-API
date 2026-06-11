const express = require('express');
const router = express.Router();
const { analyzeProfile, getProfilesList, getSingleProfile } = require('../controllers/githubController');

router.get('/', getProfilesList);
router.post('/:username', analyzeProfile);
router.get('/:username', getSingleProfile);

module.exports = router;
