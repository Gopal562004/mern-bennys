import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Breadcrumb from "../../components/Breadcrumb";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import SortControls from "./components/SortControls";
import PaginationControls from "./components/PaginationControls";
import MovieGridSkeleton from "./components/MovieGridSkeleton";
import EmptyState from "./components/EmptyState";
import { getMovies } from "../../lib/mongo/services/movieService";

const MoviesListing = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  // Get user from localStorage on component mount
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        // User is optional - if exists, set it
        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } else {
          // No user is OK - just set to null
          setUser(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Even on error, just set user to null, don't redirect
        setUser(null);
      }
    };

    getUserFromStorage();
  }, []);

  // Fetch movies from API
  const fetchMovies = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortBy: sortBy,
        order: sortOrder.toLowerCase(),
      };

      const response = await getMovies(params);

      // Handle your API response format
      if (response && response.data) {
        setMovies(response.data || []);
        setTotalMovies(response.total || 0);
        setTotalPages(response.totalPages || 0);
      } else {
        setError("No data received from server");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          navigate("/login");
          return;
        }
        setError(
          error.response.data?.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request was made but no response
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError(error.message || "Failed to load movies");
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
  }, [currentPage, searchQuery, sortBy, sortOrder, user]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const breadcrumbItems = [
    { label: "Home", path: "/movies-listing" },
    { label: "Movies", path: "/movies-listing" },
  ];

  // Format genre string to array
  const formatGenres = (genreString) => {
    if (!genreString) return [];
    return genreString.split(", ").map((g) => g.trim());
  };

  // Get release year from date string
  const getReleaseYear = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar onLogout={handleLogout} />
      <div className="main-content">
        <Breadcrumb items={breadcrumbItems} />

        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md flex items-center justify-between">
              <div className="text-error text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                {error}
              </div>
              <button
                onClick={fetchMovies}
                className="px-3 py-1 text-sm bg-error text-white rounded hover:bg-error/80 transition-smooth"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Discover Movies
            </h1>
            <p className="text-muted-foreground">
              Browse our extensive collection of movies from various genres and
              eras
            </p>
            {!loading && totalMovies > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Page {currentPage} of {totalPages} • Showing {movies.length} of{" "}
                {totalMovies} movies
              </p>
            )}
          </div>

          <div className="bg-card rounded-lg elevation-2 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  resultsCount={totalMovies}
                />
              </div>
              <div>
                <SortControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  onOrderChange={handleOrderChange}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <MovieGridSkeleton count={itemsPerPage} />
          ) : movies?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {movies?.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={{
                      id: movie._id,
                      title: movie.title,
                      description:
                        movie.description || "No description available",
                      poster:
                        movie.posterUrl ||
                        "https://images.unsplash.com/photo-1595769812729-76e01f8df4a3?w=400&h=600&fit=crop",
                      posterAlt: movie.title,
                      rating: movie.rating || 0,
                      releaseYear: getReleaseYear(movie.releaseDate),
                      releaseDate: movie.releaseDate,
                      duration: movie.duration || 0,
                      genres: formatGenres(movie.genre),
                      slug: movie.slug,
                      director: movie.director,
                      actors: movie.actors,
                      imdbId: movie.imdbId,
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesListing;
