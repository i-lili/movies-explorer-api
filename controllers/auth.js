const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require('../errors/Errors');

// Регистрация нового пользователя
const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    res.status(201).send({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

// Вход пользователя
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'development-secret', {
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
