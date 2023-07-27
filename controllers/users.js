const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
} = require('../errors/Errors');

// Получение информации о текущем пользователе
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// Обновление информации о пользователе
const updateUser = async (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
};
