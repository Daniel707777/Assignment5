const express = require('express');
const { param } = require('express-validator');
const menuItems = require('../data/menuItems');
const { menuItemRules, validateMenuItem } = require('../middleware/menuValidation');

const router = express.Router();
let nextMenuItemId = Math.max(...menuItems.map((item) => item.id), 0) + 1;

function findMenuItem(id) {
  return menuItems.find((item) => item.id === Number(id));
}

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Menu item ID must be a positive integer.' });
  }
  next();
}

// GET /api/menu - Return every menu item.
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
});

// GET /api/menu/:id - Return one menu item.
router.get('/:id', validateId, (req, res) => {
  const menuItem = findMenuItem(req.params.id);
  if (!menuItem) {
    return res.status(404).json({ success: false, message: `Menu item ${req.params.id} was not found.` });
  }
  res.status(200).json({ success: true, data: menuItem });
});

// POST /api/menu - Create a menu item after validation.
router.post('/', menuItemRules, validateMenuItem, (req, res) => {
  const newMenuItem = {
    id: nextMenuItemId++,
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    price: req.body.price,
    category: req.body.category,
    ingredients: req.body.ingredients.map((ingredient) => ingredient.trim()),
    available: req.body.available
  };

  menuItems.push(newMenuItem);
  res.status(201).json({ success: true, message: 'Menu item created successfully.', data: newMenuItem });
});

// PUT /api/menu/:id - Replace editable fields on an existing menu item.
router.put('/:id', validateId, menuItemRules, validateMenuItem, (req, res) => {
  const menuItem = findMenuItem(req.params.id);
  if (!menuItem) {
    return res.status(404).json({ success: false, message: `Menu item ${req.params.id} was not found.` });
  }

  Object.assign(menuItem, {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    price: req.body.price,
    category: req.body.category,
    ingredients: req.body.ingredients.map((ingredient) => ingredient.trim()),
    available: req.body.available
  });

  res.status(200).json({ success: true, message: 'Menu item updated successfully.', data: menuItem });
});

// DELETE /api/menu/:id - Delete an existing menu item.
router.delete('/:id', validateId, (req, res) => {
  const menuItemIndex = menuItems.findIndex((item) => item.id === Number(req.params.id));
  if (menuItemIndex === -1) {
    return res.status(404).json({ success: false, message: `Menu item ${req.params.id} was not found.` });
  }

  const [deletedMenuItem] = menuItems.splice(menuItemIndex, 1);
  res.status(200).json({ success: true, message: 'Menu item deleted successfully.', data: deletedMenuItem });
});

module.exports = router;
