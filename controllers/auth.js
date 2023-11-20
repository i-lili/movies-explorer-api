const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { BadRequestError, ConflictError, UnauthorizedError } = require('../errors/Errors');
const { ERROR_MESSAGES } = require('../constants');
const { JWT_SECRET } = require('../config');

const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).send({
      name: user.name,
      email: user.email,
      token, // Используем сокращенный синтаксис и удаляем комментарий
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError(ERROR_MESSAGES.EMAIL_CONFLICT));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
};
