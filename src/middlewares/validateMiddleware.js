const { body, validationResult } = require('express-validator');

// Validation rules for signup
const signupValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
      .matches(/\d/).withMessage('Password must contain at least one number.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
  validate,
};
