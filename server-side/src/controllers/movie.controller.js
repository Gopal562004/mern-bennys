import Movie from "../models/Movie.js";
import { pushToMovieQueue } from "../queue/movieQueue.js";
import cloudinary from "../config/cloudinary.js";
//  GET /movies (search + sort + pagination)
export const listMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { search = "", sortBy = "title", order = "asc" } = req.query;

    const filter = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
          ],
        }
      : {};

    const sort = {
      [sortBy]: order === "desc" ? -1 : 1,
    };

    const movies = await Movie.find(filter).sort(sort).skip(skip).limit(limit);

    const total = await Movie.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching movies failed", error });
  }
};

// GET /movies/:slug
export const getMovieDetail = async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Fetching movie detail failed", error });
  }
};

// ADMIN
// export const createMovie = async (req, res) => {
//   try {
//     const movie = await Movie.create(req.body);
//     res.status(201).json(movie);
//   } catch (error) {
//     console.log("CREATE ERROR:", error); // add this
//     res.status(500).json({ message: error.message });
//   }
// };
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      posterUrl: req.file?.path,
    });

    res.status(201).json(movie);
  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Update movie failed", error });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete movie failed", error });
  }
};

// queue
export const queueMovie = async (req, res) => {
  try {
    pushToMovieQueue(req.body);
    res.json({ message: "Movie added to queue" });
  } catch (error) {
    res.status(500).json({ message: "Queue insert failed", error });
  }
};
