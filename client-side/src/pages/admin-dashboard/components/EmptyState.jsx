import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No movies found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No movies match your current filters. Try adjusting your search
          criteria or clear all filters.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon name="Film" size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No movies yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Get started by adding your first movie to the database. You can manage
        all your movies from this dashboard.
      </p>
      <Button
        variant="default"
        onClick={() => navigate("/add-movie")}
        iconName="Plus"
        iconPosition="left"
      >
        Add Your First Movie
      </Button>
    </div>
  );
};

export default EmptyState;
