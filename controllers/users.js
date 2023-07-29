// Импортируем модель пользователя, классы ошибок и сообщения об ошибках
const User = require('../models/user');
const { BadRequestError, NotFoundError, ConflictError } = require('../errors/Errors');
const { ERROR_MESSAGES } = require('../constants');

// Обработчик для получения информации о текущем пользователе
const getCurrentUser = async (req, res, next) => {
  try {
    // Получаем id пользователя из объекта запроса
    const userId = req.user._id;

    // Находим пользователя в базе данных по его id
    const user = await User.findById(userId);

    // Если пользователя не найдено, выбрасываем ошибку
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Отправляем информацию о пользователе в ответ
    res.send(user);
  } catch (error) {
    // Передаем ошибку обработчику ошибок
    next(error);
  }
};

// Обработчик для обновления информации о пользователе
const updateUser = async (req, res, next) => {
  // Извлекаем email и имя пользователя из тела запроса
  const { email, name } = req.body;

  // Получаем id текущего пользователя
  const userId = req.user._id;

  try {
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });

    // Если такой пользователь существует и это не текущий пользователь, выбрасываем ошибку
    if (existingUser && String(existingUser._id) !== String(userId)) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_CONFLICT);
    }

    // Обновляем информацию пользователя в базе данных
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );

    // Если пользователя не найдено (например, был удален во время запроса), выбрасываем ошибку
    if (!updatedUser) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Отправляем обновленную информацию о пользователе в ответ
    res.send(updatedUser);
  } catch (error) {
    // Если ошибка связана с валидацией данных, выбрасываем BadRequestError,
    // в противном случае передаем ошибку дальше в цепочку обработчиков
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

// Экспортируем обработчики
module.exports = {
  getCurrentUser,
  updateUser,
};
