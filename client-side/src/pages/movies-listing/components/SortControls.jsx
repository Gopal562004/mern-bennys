import React from "react";
import Select from "../../../components/ui/Select";

const SortControls = ({ sortBy, sortOrder, onSortChange, onOrderChange }) => {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "rating", label: "Rating" },
    { value: "releaseDate", label: "Release Date" },
    { value: "duration", label: "Duration" },
  ];

  const orderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
        />
      </div>
      <div className="flex-1">
        <Select
          label="Order"
          options={orderOptions}
          value={sortOrder}
          onChange={onOrderChange}
        />
      </div>
    </div>
  );
};

export default SortControls;
