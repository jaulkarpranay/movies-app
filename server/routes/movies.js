const express = require("express");
const {
  getMovie,
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getMoviesBySearch,
} = require("../controllers/movies.js");
const catchAsync = require("../utils/catchAsync.js");
const router = express.Router();

router.route("/").get(catchAsync(getMovies)).post(catchAsync(addMovie));
router.get("/search", catchAsync(getMoviesBySearch));
router.route("/:_id").get(catchAsync(getMovie)).patch(catchAsync(updateMovie)).delete(catchAsync(deleteMovie));

module.exports = router;
