import axios from "../../../utils/axiosInstance";

// LIST / search / sort / pagination
export const getMovies = async ({
  page = 1,
  limit = 8,
  search = "",
  sortBy = "title",
  order = "asc",
}) => {
  const res = await axios.get("/movies", {
    params: { page, limit, search, sortBy, order },
  });
  return res.data;
};

// single movie detail by slug
export const getMovieDetail = async (slug) => {
  const res = await axios.get(`/movies/${slug}`);
  return res.data;
};

// admin create
export const createMovie = async (payload) => {
  const res = await axios.post("/movies", payload);
  return res.data;
};

// admin update
export const updateMovie = async (id, payload) => {
  const res = await axios.put(`/movies/${id}`, payload);
  return res.data;
};

// admin delete
export const deleteMovie = async (id) => {
  const res = await axios.delete(`/movies/${id}`);
  return res.data;
};

// queue insert
export const addToQueue = async (payload) => {
  const res = await axios.post(`/movies/queue`, payload);
  return res.data;
};
