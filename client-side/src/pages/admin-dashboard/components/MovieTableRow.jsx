import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const MovieTableRow = ({ movie, onDelete, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-movie/${movie?.slug}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
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
      <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(movie?.id, e?.target?.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
            aria-label={`Select ${movie?.title}`}
          />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-muted">
              <Image
                src={movie?.poster}
                alt={movie?.posterAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">
                {movie?.title}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {movie?.genre}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-warning fill-warning" />
            <span className="font-medium text-foreground">
              {movie?.rating?.toFixed(1)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-foreground">
          {new Date(movie.releaseDate)?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="px-4 py-3 text-foreground">
          {formatDuration(movie?.duration)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              iconName="Pencil"
              iconSize={18}
              className="hover:bg-primary/10 hover:text-primary"
              aria-label={`Edit ${movie?.title}`}
            >
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              iconName="Trash2"
              iconSize={18}
              className="hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${movie?.title}`}
            >
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </td>
      </tr>
      {showDeleteDialog && (
        <tr>
          <td colSpan="6" className="p-0">
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
                      Are you sure you want to delete "{movie?.title}"? This
                      action cannot be undone.
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
          </td>
        </tr>
      )}
    </>
  );
};

export default MovieTableRow;
