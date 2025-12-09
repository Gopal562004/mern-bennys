import React from "react";
import Button from "../../../components/ui/Button";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages?.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages?.push(i);
        }
        pages?.push("...");
        pages?.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages?.push(1);
        pages?.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages?.push(i);
        }
      } else {
        pages?.push(1);
        pages?.push("...");
        pages?.push(currentPage - 1);
        pages?.push(currentPage);
        pages?.push(currentPage + 1);
        pages?.push("...");
        pages?.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        iconName="ChevronLeft"
        iconPosition="left"
      >
        Previous
      </Button>
      <div className="flex items-center gap-1">
        {getPageNumbers()?.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-muted-foreground">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        iconName="ChevronRight"
        iconPosition="right"
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
