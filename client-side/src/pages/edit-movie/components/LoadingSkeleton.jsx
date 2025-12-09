import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded skeleton" />
            <div className="h-10 bg-muted rounded skeleton" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded skeleton" />
            <div className="h-32 bg-muted rounded skeleton" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded skeleton" />
              <div className="h-10 bg-muted rounded skeleton" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded skeleton" />
              <div className="h-10 bg-muted rounded skeleton" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded skeleton" />
              <div className="h-10 bg-muted rounded skeleton" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded skeleton" />
              <div className="h-10 bg-muted rounded skeleton" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted rounded skeleton" />
          <div className="aspect-[2/3] bg-muted rounded-lg skeleton" />
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-border">
        <div className="h-10 w-32 bg-muted rounded skeleton" />
        <div className="h-10 w-24 bg-muted rounded skeleton" />
        <div className="h-10 w-32 bg-muted rounded skeleton ml-auto" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
