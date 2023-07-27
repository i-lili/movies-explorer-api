const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.message('Неправильный формат ссылки');
  }
  return value;
};

const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateMovie = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
});

const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateMovie,
  validateMovieId,
  validateUserUpdate,
};
