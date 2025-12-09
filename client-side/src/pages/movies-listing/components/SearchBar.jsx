import React from "react";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const SearchBar = ({ searchQuery, onSearchChange, resultsCount }) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search movies by name or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded-full transition-smooth"
              aria-label="Clear search"
            >
              <Icon name="X" size={18} className="text-muted-foreground" />
            </button>
          )}
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-muted-foreground">
          Found {resultsCount} {resultsCount === 1 ? "movie" : "movies"}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
