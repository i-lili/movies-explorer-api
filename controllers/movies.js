const Movie = require('../models/movie');
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors/Errors');

// Получение всех сохранённых пользователем фильмов
const getUserMovies = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const movies = await Movie.find({ owner: userId });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

// Создание фильма
const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    });
    res.send(movie);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

// Удаление фильма
const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(_id);

    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }

    if (!movie.owner.equals(userId)) {
      throw new ForbiddenError('Нельзя удалять чужие фильмы');
    }

    await Movie.deleteOne(movie);
    res.send(movie);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
};
