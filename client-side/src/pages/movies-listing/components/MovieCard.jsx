import React from "react";
import { useNavigate } from "react-router-dom";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Use slug for navigation instead of ID
    if (movie?.slug) {
      navigate(`/movie-details/${movie.slug}`);
    } else {
      // Fallback to ID if slug is not available
      navigate(`/movie-details/${movie?.id}`);
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden elevation-2 hover-scale transition-smooth">
      <div className="relative h-80 overflow-hidden">
        <Image
          src={movie?.poster}
          alt={movie?.posterAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
          <Icon name="Star" size={16} className="fill-current" />
          <span>{movie?.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
          {movie?.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Icon name="Calendar" size={16} />
            <span>{movie?.releaseYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Clock" size={16} />
            <span>{movie?.duration} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {movie?.genres?.slice(0, 3)?.map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {genre}
            </span>
          ))}
        </div>

        <Button
          variant="default"
          fullWidth
          onClick={handleViewDetails}
          iconName="Eye"
          iconPosition="left"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
