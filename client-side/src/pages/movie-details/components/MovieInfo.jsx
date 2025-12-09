import React from "react";
import Icon from "../../../components/AppIcon";

const MovieInfo = ({ movie }) => {
  const infoSections = [
    {
      title: "Director",
      icon: "Clapperboard",
      content: movie?.director,
    },
    {
      title: "Writers",
      icon: "Pen",
      content: movie?.writers?.join(", "),
    },
    {
      title: "Production",
      icon: "Building2",
      content: movie?.production,
    },
    {
      title: "Language",
      icon: "Languages",
      content: movie?.language,
    },
    {
      title: "Country",
      icon: "MapPin",
      content: movie?.country,
    },
    {
      title: "Budget",
      icon: "DollarSign",
      content: movie?.budget,
    },
    {
      title: "Box Office",
      icon: "TrendingUp",
      content: movie?.boxOffice,
    },
    {
      title: "Release Date",
      icon: "CalendarDays",
      content: movie?.releaseDate,
    },
  ];

  return (
    <div className="bg-card rounded-lg elevation-2 p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Icon name="Info" size={28} className="text-primary" />
        Movie Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoSections?.map((section, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={section?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                {section?.title}
              </h3>
              <p className="text-base text-foreground font-medium break-words">
                {section?.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieInfo;
