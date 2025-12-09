import React from "react";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const genreOptions = [
    { value: "", label: "All Genres" },
    { value: "Action", label: "Action" },
    { value: "Drama", label: "Drama" },
    { value: "Comedy", label: "Comedy" },
    { value: "Thriller", label: "Thriller" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Horror", label: "Horror" },
    { value: "Romance", label: "Romance" },
    { value: "Adventure", label: "Adventure" },
  ];

  const yearOptions = [
    { value: "", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
  ];

  const hasActiveFilters =
    filters?.genre || filters?.year || filters?.minRating || filters?.maxRating;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Active
            </span>
          )}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Genre"
          options={genreOptions}
          value={filters?.genre}
          onChange={(value) => onFilterChange("genre", value)}
          placeholder="Select genre"
        />

        <Select
          label="Release Year"
          options={yearOptions}
          value={filters?.year}
          onChange={(value) => onFilterChange("year", value)}
          placeholder="Select year"
        />

        <Input
          label="Min Rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={filters?.minRating}
          onChange={(e) => onFilterChange("minRating", e?.target?.value)}
          placeholder="0.0"
        />

        <Input
          label="Max Rating"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={filters?.maxRating}
          onChange={(e) => onFilterChange("maxRating", e?.target?.value)}
          placeholder="10.0"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
