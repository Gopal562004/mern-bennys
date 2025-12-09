import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  listMovies,
  getMovieDetail,
  createMovie,
  updateMovie,
  deleteMovie,
  queueMovie,
} from "../controllers/movie.controller.js";

import { auth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

// LIST + search + sort + pagination
router.get("/", listMovies);

// detail by slug
router.get("/:slug", getMovieDetail);

// ADMIN operations
router.post(
  "/",
  auth,
  upload.single("poster"),
  allowRoles(["admin"]),
  createMovie
);
router.put("/:id", auth, allowRoles(["admin"]), updateMovie);
router.delete("/:id", auth, allowRoles(["admin"]), deleteMovie);

// queue insert
router.post("/queue", auth, allowRoles(["admin"]), queueMovie);

export default router;
