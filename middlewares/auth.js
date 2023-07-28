const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/Errors');
const { JWT_SECRET } = require('../config');
const { ERROR_MESSAGES } = require('../constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }

  req.user = payload;

  next();
};
