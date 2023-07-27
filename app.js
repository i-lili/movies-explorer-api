require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { NotFoundError } = require('./errors/Errors');
const errorHandler = require('./middlewares/errorHandler');

// Импорт маршрутов
const { authRouter, movieRouter, userRouter } = require('./routes');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(cors);
app.use(requestLogger);

// Использование маршрутов
app.use('/', authRouter);
app.use(auth); // Подключение middleware авторизации
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
