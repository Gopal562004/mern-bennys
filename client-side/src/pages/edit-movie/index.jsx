import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Changed from useSearchParams to useParams
import AppBar from "../../components/AppBar";
import Breadcrumb from "../../components/Breadcrumb";
import MovieForm from "./components/MovieForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import UnsavedChangesDialog from "./components/UnsavedChangesDialog";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Button from "../../components/ui/Button";
import {
  getMovieDetail,
  updateMovie,
  deleteMovie,
} from "../../lib/mongo/services/movieService";

const EditMovie = () => {
  const navigate = useNavigate();
  const { slug } = useParams(); // Use useParams to get slug from URL

  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalMovie, setOriginalMovie] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Get user from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);

          // Check if user is admin
          if (userData?.role !== "admin") {
            navigate("/movies-listing");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    };

    getUserFromStorage();
  }, [navigate]);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug || !user) return;

      try {
        setLoading(true);
        const movieData = await getMovieDetail(slug);

        if (movieData && movieData._id) {
          // Format the movie data for the form
          const formattedMovie = {
            id: movieData._id,
            title: movieData.title,
            description: movieData.description,
            rating: movieData.rating,
            releaseDate: movieData.releaseDate?.split("T")[0] || "", // Format for date input
            duration: movieData.duration,
            genre: movieData.genre,
            poster: movieData.posterUrl,
            director: movieData.director || "",
            actors: movieData.actors || "",
            imdbId: movieData.imdbId || "",
            language: movieData.language || "English",
            country: movieData.country || "",
            slug: movieData.slug || "",
            production: movieData.production || "",
            budget: movieData.budget || "",
          };

          setMovie(formattedMovie);
          setOriginalMovie(JSON.parse(JSON.stringify(formattedMovie)));
        } else {
          navigate("/admin-dashboard");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);

        if (error.response?.status === 404) {
          setSnackbar({
            show: true,
            message: "Movie not found",
            type: "error",
          });
        } else if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setSnackbar({
            show: true,
            message: "Failed to load movie details",
            type: "error",
          });
        }
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMovie();
    }
  }, [slug, user, navigate]);

  // Check for unsaved changes
  useEffect(() => {
    if (movie && originalMovie) {
      const changed = JSON.stringify(movie) !== JSON.stringify(originalMovie);
      setHasUnsavedChanges(changed);
    }
  }, [movie, originalMovie]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSubmit = async (formData) => {
    if (!movie?.id || !user) return;

    setSubmitting(true);

    try {
      // Prepare data for API
      const movieData = {
        title: formData.title,
        description: formData.description,
        rating: parseFloat(formData.rating),
        releaseDate: formData.releaseDate,
        duration: parseInt(formData.duration),
        genre: formData.genre,
        director: formData.director,
        actors: formData.actors,
        imdbId: formData.imdbId,
        language: formData.language,
        country: formData.country,
        production: formData.production,
        budget: formData.budget,
        // Note: poster upload would need separate handling with FormData
      };

      await updateMovie(movie.id, movieData);

      setSubmitting(false);
      setHasUnsavedChanges(false);

      setSnackbar({
        show: true,
        message: "Movie updated successfully",
        type: "success",
      });

      // Update local state
      setMovie(formData);
      setOriginalMovie(JSON.parse(JSON.stringify(formData)));

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating movie:", error);
      setSubmitting(false);

      setSnackbar({
        show: true,
        message: error.response?.data?.message || "Failed to update movie",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      navigate("/admin-dashboard");
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!movie?.id) return;

    setDeleting(true);

    try {
      await deleteMovie(movie.id);

      setDeleting(false);
      setShowDeleteDialog(false);

      setSnackbar({
        show: true,
        message: "Movie deleted successfully",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error deleting movie:", error);
      setDeleting(false);

      setSnackbar({
        show: true,
        message: error.response?.data?.message || "Failed to delete movie",
        type: "error",
      });
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    setHasUnsavedChanges(false);
    navigate("/admin-dashboard");
  };

  const handleSaveChanges = () => {
    setShowUnsavedDialog(false);
    // Trigger form submission
    const formElement = document.querySelector("form");
    if (formElement) {
      formElement?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Edit Movie" },
  ];

  // Show snackbar
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar onLogout={handleLogout} />

      <Breadcrumb items={breadcrumbItems} />

      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card rounded-lg elevation-2 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Edit Movie
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update movie information and manage content
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading || submitting || deleting}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete Movie
              </Button>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : movie ? (
              <MovieForm
                movie={movie}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={submitting}
                mode="edit"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Movie not found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <DeleteConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        movieTitle={movie?.title || ""}
        loading={deleting}
      />

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onClose={() => setShowUnsavedDialog(false)}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveChanges}
      />

      {/* Snackbar Notification */}
      {snackbar.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-lg elevation-8 p-4 flex items-center gap-3 max-w-md">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              snackbar?.type === "success" ? "bg-success/10" : "bg-error/10"
            }`}
          >
            <div
              className={
                snackbar?.type === "success" ? "text-success" : "text-error"
              }
            >
              {snackbar?.type === "success" ? "✓" : "✗"}
            </div>
          </div>
          <p className="text-sm font-medium text-foreground">
            {snackbar?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default EditMovie;
