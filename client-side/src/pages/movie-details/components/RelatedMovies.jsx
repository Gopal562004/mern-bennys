import React from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RelatedMovies = ({ movies }) => {
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    navigate(`/movie-details?id=${movieId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-card rounded-lg elevation-2 p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Icon name="Film" size={28} className="text-primary" />
        Related Movies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies?.map((movie) => (
          <div
            key={movie?.id}
            className="group cursor-pointer"
            onClick={() => handleMovieClick(movie?.id)}
          >
            <div className="relative rounded-lg overflow-hidden elevation-2 aspect-[2/3] mb-3 hover-scale">
              <Image
                src={movie?.poster}
                alt={movie?.posterAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1 text-warning mb-1">
                    <Icon name="Star" size={14} className="fill-current" />
                    <span className="text-xs font-bold">{movie?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1 truncate group-hover:text-primary transition-smooth">
              {movie?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {movie?.releaseYear}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/movies-listing")}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Browse All Movies
        </Button>
      </div>
    </div>
  );
};

export default RelatedMovies;
