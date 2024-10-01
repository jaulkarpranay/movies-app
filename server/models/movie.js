const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    directors: [{ type: String, required: true }],
    releaseYear: { type: String, required: true },
    rating: { type: String, required: true },
    imdbId: { type: String },
  },
  { additionnalProperties: true }
);

const user = mongoose.model("Movie", userSchema);

module.exports = user;
