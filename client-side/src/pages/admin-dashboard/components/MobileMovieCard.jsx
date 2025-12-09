import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const MobileMovieCard = ({ movie, onDelete, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-movie/${movie?.slug}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowActions(false);
  };

  const confirmDelete = () => {
    onDelete(movie?.id);
    setShowDeleteDialog(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(movie?.id, e?.target?.checked)}
            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
            aria-label={`Select ${movie?.title}`}
          />

          <div className="w-20 h-28 rounded overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={movie?.poster}
              alt={movie?.posterAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">
              {movie?.title}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <Icon
                name="Star"
                size={14}
                className="text-warning fill-warning"
              />
              <span className="text-sm font-medium text-foreground">
                {movie?.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{movie?.genre}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(movie.releaseDate)?.getFullYear()} •{" "}
              {formatDuration(movie?.duration)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            iconName="MoreVertical"
            iconSize={20}
            className="flex-shrink-0"
            aria-label="More actions"
          >
            <span className="sr-only">More actions</span>
          </Button>
        </div>

        {showActions && (
          <div className="border-t border-border pt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              iconName="Pencil"
              iconPosition="left"
              fullWidth
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              iconName="Trash2"
              iconPosition="left"
              fullWidth
            >
              Delete
            </Button>
          </div>
        )}
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
                  Delete Movie
                </h3>
                <p className="text-muted-foreground">
                  Are you sure you want to delete "{movie?.title}"? This action
                  cannot be undone.
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
                onClick={confirmDelete}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Movie
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMovieCard;
