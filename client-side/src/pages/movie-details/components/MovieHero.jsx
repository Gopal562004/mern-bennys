import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const MovieHero = ({ movie }) => {
  return (
    <div className="relative w-full bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="relative rounded-lg overflow-hidden elevation-4 aspect-[2/3] max-w-md mx-auto lg:mx-0">
              <Image
                src={movie?.poster}
                alt={movie?.posterAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Movie Information */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {movie?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  <span className="text-sm font-medium">
                    {movie?.releaseYear}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={18} />
                  <span className="text-sm font-medium">{movie?.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1 rounded-full">
                  <Icon name="Star" size={18} className="fill-current" />
                  <span className="text-sm font-bold">{movie?.rating}/10</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie?.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-base lg:text-lg text-foreground leading-relaxed">
              {movie?.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth elevation-2">
                <Icon name="Play" size={20} className="fill-current" />
                <span>Watch Trailer</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border text-foreground rounded-lg font-medium hover:bg-muted transition-smooth">
                <Icon name="Heart" size={20} />
                <span>Add to Favorites</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-card border-2 border-border text-foreground rounded-lg font-medium hover:bg-muted transition-smooth">
                <Icon name="Share2" size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
