import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import connectDB from "../config/db.js";
import Movie from "../models/Movie.js";

dotenv.config();

// sample list — add full 250 here
const imdbTop250 = [
  "tt0111161",
  "tt0068646",
  "tt0468569",
  "tt0071562",
  "tt0050083",
  "tt0108052",
  "tt0167260",
  "tt0110912",
  "tt0060196",
  "tt0137523",
  "tt0120737",
  "tt0109830",
  "tt1375666",
  "tt0167261",
  "tt0133093",
  "tt0099685",
  "tt0073486",
  "tt0047478",
  "tt0114369",
  "tt0317248",
  "tt0245429",
  "tt0120815",
  "tt0120689",
  "tt0102926",
  "tt0038650",
  "tt0027977",
  "tt6751668",
  "tt0021749",
  "tt0816692",
  "tt0120586",
  "tt0118799",
  "tt0120586",
  "tt0317705",
  "tt0103064",
  "tt0095327",
  "tt0120812",
  "tt0078788",
  "tt0054215",
  "tt0032553",
  "tt0047396",
  "tt0078788",
  "tt0059578",
  "tt0110357",
  "tt0253474",
  "tt0057012",
  "tt0172495",
  "tt0086190",
  "tt0080684",
  "tt0110413",
  "tt0245712",
  "tt2582802",
  "tt0078748",
  "tt0405094",
  "tt0038650",
  "tt1853728",
  "tt0105236",
  "tt0053125",
  "tt0083658",
  "tt0093058",
  "tt0209144",
  "tt0095765",
  "tt0047396",
  "tt0088763",
  "tt0114814",
  "tt0075314",
  "tt0034583",
  "tt0043014",
  "tt0211915",
  "tt0110357",
  "tt0076759",
  "tt4154756",
  "tt0091251",
  "tt0364569",
  "tt0114709",
  "tt0022100",
  "tt0071853",
  "tt0169547",
  "tt0096283",
  "tt0045152",
  "tt0062622",
  "tt0056058",
  "tt0053570",
  "tt0055630",
  "tt0120815",
  "tt0107207",
  "tt0102598",
  "tt0118971",
  "tt0056592",
  "tt0061418",
  "tt0087843",
  "tt4154796",
  "tt0993846",
  "tt0082096",
  "tt0073195",
  "tt0286106",
  "tt0047296",
  "tt0169102",
  "tt0129387",
  "tt0070047",
  "tt0059578",
  "tt0056172",
  "tt0100780",
  "tt2015381",
  "tt0361748",
  "tt0040522",
  "tt0113277",
  "tt0050783",
  "tt0036868",
  "tt0018468",
  "tt0031679",
  "tt0061512",
  "tt0090605",
  "tt00700809", // etc…
]; 

async function importAll() {
  await connectDB();

  for (const imdbId of imdbTop250) {
    try {
      const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`;
      const { data } = await axios.get(url);

      if (data.Response === "False") {
        console.log("Not found:", imdbId);
        continue;
      }

      // generate unique slug
      let baseSlug = data.Title.toLowerCase().split(" ").join("-");
      let slug = baseSlug;

      let counter = 1;
      while (await Movie.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const movie = {
        title: data.Title,
        description: data.Plot,
        rating: Number(data.imdbRating),
        releaseDate: new Date(data.Released),
        duration: parseInt(data.Runtime),
        posterUrl: data.Poster,
        imdbId: data.imdbID,
        genre: data.Genre,
        actors: data.Actors,
        director: data.Director,
        slug, // <—
      };

      await Movie.findOneAndUpdate({ imdbId }, movie, { upsert: true });

      console.log("Imported:", movie.title);
    } catch (err) {
      console.log("ERROR", imdbId, err.message);
    }
  }

  mongoose.connection.close();
  console.log("DONE IMPORT");
}

importAll();
