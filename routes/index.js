const authRouter = require('./auth');
const movieRouter = require('./movies');
const userRouter = require('./users');
const auth = require('../middlewares/auth');

module.exports = (app) => {
  app.use('/', authRouter); // Без авторизации
  app.use(auth); // Подключение middleware авторизации
  app.use('/users', userRouter);
  app.use('/movies', movieRouter);
};
