import Movie from "../models/Movie.js";

const movieInsertQueue = []; // temporary queue in RAM

// push movie job into queue
export const pushToMovieQueue = (movieData) => {
  movieInsertQueue.push(movieData);
  console.log("Movie queued:", movieData.title);
};

// background worker
export const startMovieQueueWorker = () => {
  setInterval(async () => {
    if (movieInsertQueue.length === 0) return;

    // take max 5 per batch
    const batch = movieInsertQueue.splice(0, 5);

    try {
      await Movie.insertMany(batch);
      console.log(`Inserted batch of ${batch.length} movies`);
    } catch (error) {
      console.error("Batch insertion failed:", error);
    }
  }, 5000); // every 5 sec
};
