const Movie = require("../models/movie.js");

module.exports.getMovie = async (req, res, next) => {
  const { _id } = req.params;

  const movie = await Movie.findOne({ _id });

  if (!movie) return res.status(404).json({ error: "NO_MOVIE_FOUND" });

  return res.status(200).json(movie);
};

module.exports.getMovies = async (req, res, next) => {
  let { page, limit } = req.query;
  page = !!page ? Number(page) : 1;
  limit = !!limit ? Number(limit) : 10;

  const startIndex = (page - 1) * limit;
  const total = await Movie.countDocuments();

  const movies = await Movie.find().sort("-rating").skip(startIndex).limit(limit);

  res.status(200).json({
    movies,
    noOfPages: Math.ceil(total / limit),
  });
};

module.exports.getMoviesBySearch = async (req, res, next) => {
  let { q, rating, page, sortBy, limit, releaseYear } = req.query;

  page = !!page ? Number(page) : 1;
  limit = !!limit ? Number(limit) : 10;
  rating = !!rating ? rating * 10 : 0;
  releaseYear = !!releaseYear ? releaseYear : 1900;
  sortBy = !!sortBy ? sortBy : "-rating";

  const startIndex = (page - 1) * limit;

  let movies = await Movie.find({
    $or: [{ title: { $regex: q, $options: "i" } }, { directors: { $regex: q, $options: "i" } }],
  });

  movies = movies
    .filter((m) => Number(m.rating) >= rating && Number(m.releaseYear) >= releaseYear)
    .sort((a, b) => {
      if (sortBy === "-rating") {
        return Number(b.rating) - Number(a.rating);
      }
      if (sortBy === "rating") {
        return Number(a.rating) - Number(b.rating);
      }
      if (sortBy === "releaseYear") {
        return Number(a.releaseYear) - Number(b.releaseYear);
      }
      if (sortBy === "-releaseYear") {
        return Number(b.releaseYear) - Number(a.releaseYear);
      }
    })
    .filter((m, i) => i >= startIndex && i <= startIndex + limit);

  res.status(200).json({
    movies,
    noOfPages: Math.ceil(movies.length / limit),
  });
  // }
};

module.exports.addMovie = async (req, res) => {
  let movieData = req.body;

  const movieInstance = new Movie({
    ...movieData,
    directors: movieData.directors
      .trim()
      .split(",")
      .filter((d) => !!d.length),
  });
  const newMovie = await movieInstance.save();

  res.status(200).json(newMovie);
};

module.exports.updateMovie = async (req, res) => {
  const { _id } = req.params;
  const movieData = req.body;
  const updatedMovie = await Movie.findByIdAndUpdate(
    _id,
    {
      ...movieData,
      directors: movieData.directors
        .trim()
        .split(",")
        .filter((d) => !!d.length),
    },
    {
      new: true,
    }
  );

  res.status(200).json(updatedMovie);
};

module.exports.deleteMovie = async (req, res) => {
  const { _id } = req.params;

  const deletedMovie = await Movie.findByIdAndDelete(_id);

  res.status(200).json(deletedMovie);
};
