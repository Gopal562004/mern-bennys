import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Breadcrumb from "../../components/Breadcrumb";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import MovieTableHeader from "./components/MovieTableHeader";
import MovieTableRow from "./components/MovieTableRow";
import FilterPanel from "./components/FilterPanel";
import BulkActionsBar from "./components/BulkActionsBar";
import MobileMovieCard from "./components/MobileMovieCard";
import TableSkeleton from "./components/TableSkeleton";
import EmptyState from "./components/EmptyState";
import { getMovies, deleteMovie } from "../../lib/mongo/services/movieService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    minRating: "",
    maxRating: "",
  });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const moviesPerPage = 10;

  // Get user from localStorage
  const [user, setUser] = useState(null);

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

  // Fetch movies from API
  const fetchMovies = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: moviesPerPage,
        search: searchQuery,
        sortBy: sortField,
        order: sortDirection,
      };

      const response = await getMovies(params);

      if (response && response.data) {
        setMovies(response.data || []);
        setTotalMovies(response.total || 0);
        setTotalPages(response.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);

      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setSnackbar({
          show: true,
          message: "Failed to load movies",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies when dependencies change
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchMovies();
      }, 300); // Debounce search

      return () => clearTimeout(timer);
    }
  }, [currentPage, searchQuery, sortField, sortDirection, filters, user]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleLogout = () => {
    setSnackbar({
      show: true,
      message: "Logged out successfully",
      type: "success",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      minRating: "",
      maxRating: "",
    });
    setSearchQuery("");
  };

  const handleSelectMovie = (id, checked) => {
    if (checked) {
      setSelectedMovies((prev) => [...prev, id]);
    } else {
      setSelectedMovies((prev) => prev?.filter((movieId) => movieId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMovies(movies?.map((movie) => movie._id));
    } else {
      setSelectedMovies([]);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await deleteMovie(id);

      // Remove from local state
      setMovies((prev) => prev?.filter((movie) => movie._id !== id));
      setSelectedMovies((prev) => prev?.filter((movieId) => movieId !== id));

      // Refresh movies count
      setTotalMovies((prev) => prev - 1);

      setSnackbar({
        show: true,
        message: "Movie deleted successfully",
        type: "success",
      });

      // Refetch movies if current page might be empty
      if (movies.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchMovies();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      setSnackbar({
        show: true,
        message: error.response?.data?.message || "Failed to delete movie",
        type: "error",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Delete all selected movies
      const deletePromises = selectedMovies.map((id) => deleteMovie(id));
      await Promise.all(deletePromises);

      // Remove from local state
      setMovies((prev) =>
        prev?.filter((movie) => !selectedMovies?.includes(movie._id))
      );

      // Update total count
      setTotalMovies((prev) => prev - selectedMovies.length);

      setSnackbar({
        show: true,
        message: `${selectedMovies?.length} ${
          selectedMovies?.length === 1 ? "movie" : "movies"
        } deleted successfully`,
        type: "success",
      });

      setSelectedMovies([]);

      // Refetch movies if needed
      fetchMovies();
    } catch (error) {
      console.error("Error in bulk delete:", error);
      setSnackbar({
        show: true,
        message: "Failed to delete movies",
        type: "error",
      });
    }
  };

  const handleExport = () => {
    const selectedMoviesData = movies?.filter((movie) =>
      selectedMovies?.includes(movie._id)
    );

    const csvContent = [
      [
        "Title",
        "Genre",
        "Rating",
        "Release Date",
        "Duration",
        "Director",
        "IMDb ID",
      ],
      ...selectedMoviesData?.map((movie) => [
        movie?.title,
        movie?.genre,
        movie?.rating,
        new Date(movie.releaseDate)?.toLocaleDateString("en-US"),
        `${Math.floor(movie?.duration / 60)}h ${movie?.duration % 60}m`,
        movie?.director || "N/A",
        movie?.imdbId || "N/A",
      ]),
    ]
      ?.map((row) => row?.join(","))
      ?.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movies-export-${
      new Date()?.toISOString()?.split("T")?.[0]
    }.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);

    setSnackbar({
      show: true,
      message: "Movies exported successfully",
      type: "success",
    });
  };

  // Apply filters to movies (client-side filtering for advanced filters)
  const filteredMovies = movies?.filter((movie) => {
    const matchesGenre =
      !filters?.genre || movie?.genre?.includes(filters?.genre);
    const matchesYear =
      !filters?.year ||
      new Date(movie.releaseDate)?.getFullYear()?.toString() === filters?.year;
    const matchesMinRating =
      !filters?.minRating || movie?.rating >= parseFloat(filters?.minRating);
    const matchesMaxRating =
      !filters?.maxRating || movie?.rating <= parseFloat(filters?.maxRating);

    return matchesGenre && matchesYear && matchesMinRating && matchesMaxRating;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breadcrumbItems = [{ label: "Dashboard", path: "/admin-dashboard" }];

  useEffect(() => {
    if (snackbar?.show) {
      const timer = setTimeout(() => {
        setSnackbar({ show: false, message: "", type: "success" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar?.show]);

  // Show loading if user not loaded yet
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
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Movie Management
              </h1>
              <p className="text-muted-foreground">
                Manage your movie database with comprehensive CRUD operations
              </p>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {totalMovies} movies • Page {currentPage} of{" "}
                  {totalPages}
                </p>
              )}
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/add-movie")}
              iconName="Plus"
              iconPosition="left"
            >
              Add New Movie
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search movies by title or description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e?.target?.value);
                  }}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                iconName="Search"
                iconSize={20}
                className="flex-shrink-0"
                aria-label="Search"
              >
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {loading ? (
            <TableSkeleton />
          ) : movies?.length === 0 ? (
            <EmptyState
              hasFilters={searchQuery || Object.values(filters).some((f) => f)}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <MovieTableHeader
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                      allSelected={
                        selectedMovies?.length === movies?.length &&
                        movies?.length > 0
                      }
                      onSelectAll={handleSelectAll}
                    />

                    <tbody>
                      {filteredMovies?.map((movie) => (
                        <MovieTableRow
                          key={movie._id}
                          movie={{
                            id: movie._id,
                            title: movie.title,
                            description: movie.description,
                            rating: movie.rating,
                            releaseDate: movie.releaseDate,
                            duration: movie.duration,
                            poster: movie.posterUrl,
                            posterAlt: movie.title,
                            genre: movie.genre,
                            director: movie.director,
                            imdbId: movie.imdbId,
                            slug: movie.slug,
                          }}
                          onDelete={handleDeleteMovie}
                          isSelected={selectedMovies?.includes(movie._id)}
                          onSelect={handleSelectMovie}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:hidden">
                {filteredMovies?.map((movie) => (
                  <MobileMovieCard
                    key={movie._id}
                    movie={{
                      id: movie._id,
                      title: movie.title,
                      description: movie.description,
                      rating: movie.rating,
                      releaseDate: movie.releaseDate,
                      duration: movie.duration,
                      poster: movie.posterUrl,
                      posterAlt: movie.title,
                      genre: movie.genre,
                      director: movie.director,
                      imdbId: movie.imdbId,
                      slug: movie.slug,
                    }}
                    onDelete={handleDeleteMovie}
                    isSelected={selectedMovies?.includes(movie._id)}
                    onSelect={handleSelectMovie}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * moviesPerPage + 1} to{" "}
                    {Math.min(currentPage * moviesPerPage, totalMovies)} of{" "}
                    {totalMovies} movies
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                      iconSize={18}
                    >
                      <span className="sr-only">Previous</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))]?.map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-md text-sm font-medium transition-smooth ${
                              currentPage === pageNum
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      iconSize={18}
                    >
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <BulkActionsBar
        selectedCount={selectedMovies?.length}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        onDeselectAll={() => setSelectedMovies([])}
      />

      {snackbar?.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border rounded-lg elevation-8 p-4 flex items-center gap-3 max-w-md">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              snackbar?.type === "success" ? "bg-success/10" : "bg-error/10"
            }`}
          >
            <Icon
              name={snackbar?.type === "success" ? "Check" : "AlertCircle"}
              size={18}
              className={
                snackbar?.type === "success" ? "text-success" : "text-error"
              }
            />
          </div>
          <p className="text-sm font-medium text-foreground">
            {snackbar?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
