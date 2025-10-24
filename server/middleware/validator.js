const { body, validationResult } = require('express-validator');

// Validation rules for Post
const postValidationRules = [
  // Required fields
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),

  body('content')
    .notEmpty().withMessage('Content is required')
    .isString().withMessage('Content must be a string'),

  body('slug')
    .notEmpty().withMessage('Slug is required')
    .isString().withMessage('Slug must be a string'),

  body('author')
    .notEmpty().withMessage('Author is required')
    .isString().withMessage('Author must be a string'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string'),

  body('excerpt')
    .optional()
    .isLength({ max: 200 }).withMessage('Excerpt cannot be more than 200 characters')
];

// Middleware to handle validation result
const validatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};


// User validation rules
const userValidationRules = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isString().withMessage('Email must be a string')
    .isEmail().withMessage('Must be a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Middleware to handle validation results
const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  postValidationRules,
  validatePost,
  userValidationRules,
  validateUser
};
