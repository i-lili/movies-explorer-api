const express = require('express');
const userController = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validation');

const router = express.Router();
// GET /users/me — возвращает информацию о текущем пользователе
router.get('/me', userController.getCurrentUser);
// PATCH /users/me — обновляет профиль
router.patch('/me', validateUserUpdate, userController.updateUser);

module.exports = router;
