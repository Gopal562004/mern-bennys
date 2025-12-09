import React from "react";
import Icon from "../../../components/AppIcon";

const MovieTableHeader = ({
  sortField,
  sortDirection,
  onSort,
  allSelected,
  onSelectAll,
}) => {
  const handleSort = (field) => {
    if (sortField === field) {
      onSort(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <Icon
          name="ChevronsUpDown"
          size={16}
          className="text-muted-foreground"
        />
      );
    }
    return sortDirection === "asc" ? (
      <Icon name="ChevronUp" size={16} className="text-primary" />
    ) : (
      <Icon name="ChevronDown" size={16} className="text-primary" />
    );
  };

  return (
    <thead className="bg-muted/50 border-b border-border">
      <tr>
        <th className="px-4 py-3 text-left">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e?.target?.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Select all movies"
          />
        </th>
        <th
          className="px-4 py-3 text-left cursor-pointer hover:bg-muted transition-smooth"
          onClick={() => handleSort("title")}
        >
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span>Movie</span>
            <SortIcon field="title" />
          </div>
        </th>
        <th
          className="px-4 py-3 text-left cursor-pointer hover:bg-muted transition-smooth"
          onClick={() => handleSort("rating")}
        >
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span>Rating</span>
            <SortIcon field="rating" />
          </div>
        </th>
        <th
          className="px-4 py-3 text-left cursor-pointer hover:bg-muted transition-smooth"
          onClick={() => handleSort("releaseDate")}
        >
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span>Release Date</span>
            <SortIcon field="releaseDate" />
          </div>
        </th>
        <th
          className="px-4 py-3 text-left cursor-pointer hover:bg-muted transition-smooth"
          onClick={() => handleSort("duration")}
        >
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span>Duration</span>
            <SortIcon field="duration" />
          </div>
        </th>
        <th className="px-4 py-3 text-left font-semibold text-foreground">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default MovieTableHeader;
