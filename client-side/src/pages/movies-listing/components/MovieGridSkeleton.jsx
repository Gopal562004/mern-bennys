import React from "react";

const MovieGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count })?.map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-lg overflow-hidden elevation-2"
        >
          <div className="skeleton h-80 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-6 w-3/4" />
            <div className="flex gap-4">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-20" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-6 w-16" />
              <div className="skeleton h-6 w-16" />
              <div className="skeleton h-6 w-16" />
            </div>
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGridSkeleton;
