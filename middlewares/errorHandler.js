// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // Если у ошибки нет статуса, устанавливаем 500
  const { statusCode = 500, message } = err;

  // Отправляем ответ с кодом статуса ошибки и ее сообщением
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
};
