import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    releaseDate: {
      type: Date,
    },

    duration: {
      type: Number,
    },

    posterUrl: {
      type: String,
    },

    imdbId: {
      type: String,
    },

    genre: {
      type: String,
    },

    actors: {
      type: String,
    },

    director: {
      type: String,
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

movieSchema.pre("save", async function () {
  if (!this.slug) {
    const baseSlug = this.title.toLowerCase().replace(/ /g, "-");
    let slug = baseSlug;

    let counter = 1;

    while (await mongoose.models.Movie.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
});


export default mongoose.model("Movie", movieSchema);
