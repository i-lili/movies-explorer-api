require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { NotFoundError } = require('./errors/Errors');
const errorHandler = require('./middlewares/errorHandler');
const { DB_URL, PORT } = require('./config'); // импортирование конфигурации
const { ERROR_MESSAGES } = require('./constants'); // импортирование сообщений об ошибках

// Импорт функции роутов
const routes = require('./routes');

const app = express();

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

// Использование функции роутов
routes(app);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ERROR_MESSAGES.SERVER_CRASH);
  }, 0);
});

app.use('*', (req, res, next) => {
  next(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
