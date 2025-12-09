import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const CastSection = ({ cast }) => {
  return (
    <div className="bg-card rounded-lg elevation-2 p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Icon name="Users" size={28} className="text-primary" />
        Cast & Crew
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {cast?.map((member) => (
          <div key={member?.id} className="group cursor-pointer">
            <div className="relative rounded-lg overflow-hidden elevation-2 aspect-[2/3] mb-3 hover-scale">
              <Image
                src={member?.image}
                alt={member?.imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1 truncate">
              {member?.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {member?.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;
