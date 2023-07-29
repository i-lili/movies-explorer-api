const express = require('express');
const movieController = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../middlewares/validation');

const router = express.Router();
// GET /movies — возвращает все сохранённые пользователем фильмы
router.get('/', movieController.getUserMovies);
// POST /movies — создаёт фильм
router.post('/', validateMovie, movieController.createMovie);
// DELETE /movies/movieId — удаляет сохранённый фильм по _id
router.delete('/:_id', validateMovieId, movieController.deleteMovie);

module.exports = router;
