const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/Errors');

// Экспортируем middleware для проверки авторизации пользователя
module.exports = (req, res, next) => {
// Извлекаем заголовок авторизации
  const { authorization } = req.headers;

  // Проверяем наличие и формат заголовка
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }

  // Удаляем "Bearer " из заголовка, чтобы получить токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  // Верифицируем токен
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
  } catch (err) {
    throw new UnauthorizedError('Authorization required');
  }

  // Если верификация прошла успешно, добавляем payload в запрос
  req.user = payload;

  // Передаём обработку запроса дальше
  next();
};
