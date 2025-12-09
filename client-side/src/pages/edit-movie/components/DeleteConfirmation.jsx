import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const DeleteConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  movieTitle,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-lg elevation-8 max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Movie
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete "{movieTitle}"? This action cannot
              be undone and will permanently remove the movie from the database.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            iconName="Trash2"
            iconPosition="left"
            className="flex-1"
          >
            Delete Movie
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
