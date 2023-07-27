const express = require('express');
const authController = require('../controllers/auth');
const { validateUser, validateLogin } = require('../middlewares/validation');

const router = express.Router();
// POST /signup — создаёт пользователя с переданными в теле email, password и name
router.post('/signup', validateUser, authController.signup);
// POST /signin — проверяет переданные в теле почту и пароль и возвращает JWT
router.post('/signin', validateLogin, authController.signin);

module.exports = router;
