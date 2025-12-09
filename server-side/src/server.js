import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { startMovieQueueWorker } from "./queue/movieQueue.js";

// ENV
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/", routes);

// DB connect
connectDB();

// start queue worker
startMovieQueueWorker();
// server run
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
