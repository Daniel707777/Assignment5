const { body, validationResult } = require('express-validator');

const menuItemRules = [
  body('name')
    .exists({ values: 'undefined' }).withMessage('Name is required.')
    .bail().isString().withMessage('Name must be a string.')
    .bail().trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),
  body('description')
    .exists({ values: 'undefined' }).withMessage('Description is required.')
    .bail().isString().withMessage('Description must be a string.')
    .bail().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
  body('price')
    .exists({ values: 'undefined' }).withMessage('Price is required.')
    .bail().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0.')
    .toFloat(),
  body('category')
    .exists({ values: 'undefined' }).withMessage('Category is required.')
    .bail().isString().withMessage('Category must be a string.')
    .bail().isIn(['appetizer', 'entree', 'dessert', 'beverage'])
    .withMessage('Category must be appetizer, entree, dessert, or beverage.'),
  body('ingredients')
    .exists({ values: 'undefined' }).withMessage('Ingredients are required.')
    .bail().isArray({ min: 1 }).withMessage('Ingredients must be an array with at least one ingredient.'),
  body('ingredients.*')
    .isString().withMessage('Each ingredient must be a string.')
    .bail().trim().notEmpty().withMessage('Ingredients cannot be empty.'),
  body('available')
    .optional()
    .isBoolean().withMessage('Available must be a boolean.')
    .toBoolean()
];

function validateMenuItem(req, res, next) {
  // Availability is optional and defaults to true for new items.
  if (req.body && req.body.available === undefined) {
    req.body.available = true;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Correct the fields listed below and try again.',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    });
  }

  next();
}

module.exports = { menuItemRules, validateMenuItem };
