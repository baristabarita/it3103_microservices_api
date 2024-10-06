const { body, validationResult } = require('express-validator');
const validator = require('validator');

// Middleware to validate and sanitize input
const inputValidation = (validationRules) => {
  return async (req, res, next) => {
    // Apply validation rules
    await Promise.all(validationRules.map((rule) => rule.run(req)));

    // Get validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If there are no validation errors, proceed
    next();
  };
};

// Common validation rules for input sanitization
const sanitizeInput = (fields) => {
  return fields.map((field) =>
    body(field)
      .trim()
      .escape()
      .customSanitizer((value) => validator.stripLow(value, { keep_new_lines: false }))
  );
};

// validation rules for reg fields (e.g., username, email, password)
const regValidationRules = [
  body('name')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_.-]*$/)
    .withMessage('Username can only contain letters, numbers, underscores, hyphens, and dots.'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format.')
    .normalizeEmail(),
  body('pass')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
  body('role')
    .notEmpty().withMessage('Role is required')
];

const logValidationRules = [
    body('email')
      .isEmail()
      .withMessage('Invalid email format.')
      .normalizeEmail(),
    body('pass')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/\d/)
      .withMessage('Password must contain at least one number.'),
  ];

  const productInputValidationRules = [
    body('name')
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters')
        .trim().escape(),
    body('description')
        .optional()
        .isLength({ max: 50 }).withMessage('Product description must be less than 500 characters')
        .trim().escape(),
    body('price')
        .isFloat({ gt: 0 }).withMessage('Product price must be a positive number')
        .toFloat(),
];

// Validation rules for new orders
const ordersValidationRules = [
    body('userId')
        .notEmpty().withMessage('Customer ID is required')
        .isAlphanumeric().withMessage('Customer ID must contain only alphanumeric characters')
        .trim().escape(),
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isAlphanumeric().withMessage('Product ID must contain only alphanumeric characters')
        .trim().escape(),
];

const editOrdersValidationRules = [
    body('userId')
        .notEmpty().withMessage('Customer ID is required')
        .trim().escape(),
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .trim().escape(),
];

module.exports = {
  inputValidation,
  sanitizeInput,
  regValidationRules,
  logValidationRules,
  productInputValidationRules,
  ordersValidationRules,
  editOrdersValidationRules,
};
