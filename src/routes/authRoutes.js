const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { signupValidationRules, loginValidationRules, validate } = require('../middlewares/validateMiddleware');

router.post('/signup', signupValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);

module.exports = router;
