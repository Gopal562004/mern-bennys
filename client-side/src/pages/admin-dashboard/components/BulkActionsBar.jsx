import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BulkActionsBar = ({
  selectedCount,
  onBulkDelete,
  onExport,
  onDeselectAll,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmBulkDelete = () => {
    onBulkDelete();
    setShowDeleteDialog(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-border rounded-lg elevation-8 p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Check" size={18} className="text-primary" />
          </div>
          <span className="font-medium text-foreground">
            {selectedCount} {selectedCount === 1 ? "movie" : "movies"} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            iconName="X"
            iconPosition="left"
          >
            Deselect
          </Button>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg elevation-8 max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name="AlertTriangle"
                  size={24}
                  className="text-destructive"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Delete Multiple Movies
                </h3>
                <p className="text-muted-foreground">
                  Are you sure you want to delete {selectedCount}{" "}
                  {selectedCount === 1 ? "movie" : "movies"}? This action cannot
                  be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmBulkDelete}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete {selectedCount}{" "}
                {selectedCount === 1 ? "Movie" : "Movies"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;
