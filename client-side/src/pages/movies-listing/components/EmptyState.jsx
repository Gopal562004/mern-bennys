import React from "react";
import Icon from "../../../components/AppIcon";

const EmptyState = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="Film" size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {searchQuery ? "No Movies Found" : "No Movies Available"}
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        {searchQuery
          ? `We couldn't find any movies matching "${searchQuery}". Try adjusting your search terms.`
          : "There are no movies in the database yet. Check back later for updates."}
      </p>
    </div>
  );
};

export default EmptyState;
