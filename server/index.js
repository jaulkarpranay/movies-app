const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const movieRoutes = require("./routes/movies.js");
const path = require("path");
const customError = require("./utils/error.js");
const PORT = process.env.PORT;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

const logger = (req, res, next) => {
  const time = new Date(Date.now());
  console.log(`${time.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}  ${req.method}  ${req.url}`);
  next();
};

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist/movies-app/browser")));
  app.use(cors({ credentials: true }));
} else {
  app.use(
    cors({
      origin: "http://localhost:4200",
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(logger);
app.use("/api/movies", movieRoutes);

mongoose
  .connect(DB_CONNECTION_URL)
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log("MongoDB Connection Error\n", error);
  });

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/movies-app/browser/index.html"));
  });
}
app.all("*", (req, res, next) => {
  next(new customError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log(`ERROR:\nat:${err.at}\n`, err);
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Something went wrong";
  res.status(err.statusCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
