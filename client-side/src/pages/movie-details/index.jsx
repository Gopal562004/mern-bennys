import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Breadcrumb from "../../components/Breadcrumb";
import Icon from "../../components/AppIcon";
import MovieHero from "./components/MovieHero";
import MovieInfo from "./components/MovieInfo";
import CastSection from "./components/CastSection";
import ReviewSection from "./components/ReviewSection";
import RelatedMovies from "./components/RelatedMovies";
import { getMovieDetail } from "../../lib/mongo/services/movieService";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);

  // Get user from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
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

  // Fetch movie details from API
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!slug) {
        setError("Movie not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // API returns movie object directly, not wrapped in data property
        const movie = await getMovieDetail(slug);

        if (movie && movie._id) {
          setMovieData(movie);
        } else {
          setError("Movie data not found");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);

        if (error.response?.status === 404) {
          setError("Movie not found");
          navigate("/movies-listing");
        } else if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError(
            error.response?.data?.message || "Failed to load movie details"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMovieDetails();
    }
  }, [slug, user, navigate]);

  const handleLogout = () => {
    navigate("/login");
  };

  // Format movie data for components
  const formatMovieData = (movie) => {
    if (!movie) return null;

    // Format genres from string to array
    const formatGenres = (genreString) => {
      if (!genreString) return [];
      return genreString.split(", ").map((g) => g.trim());
    };

    // Format duration
    const formatDuration = (minutes) => {
      if (!minutes) return "N/A";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Get release year
    const getReleaseYear = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).getFullYear();
      } catch {
        return "N/A";
      }
    };

    // Format release date
    const formatReleaseDate = (dateString) => {
      if (!dateString) return "Unknown";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return "Unknown";
      }
    };

    return {
      id: movie._id,
      title: movie.title,
      description: movie.description || "No description available",
      poster:
        movie.posterUrl ||
        "https://images.unsplash.com/photo-1595769812729-76e01f8df4a3?w=1200&h=1800&fit=crop",
      posterAlt: movie.title,
      rating: movie.rating || 0,
      releaseYear: getReleaseYear(movie.releaseDate),
      releaseDate: formatReleaseDate(movie.releaseDate),
      duration: formatDuration(movie.duration),
      genres: formatGenres(movie.genre),
      director: movie.director || "Unknown",
      writers: movie.writers ? movie.writers.split(", ") : ["Unknown"],
      actors: movie.actors || "Unknown",
      production: movie.production || "Unknown",
      language: movie.language || "English",
      country: movie.country || "Unknown",
      budget: movie.budget || "Unknown",
      boxOffice: movie.boxOffice || "Unknown",
      imdbId: movie.imdbId,
      createdAt: movie.createdAt,
      slug: movie.slug,

      // Mock cast data
      cast: generateMockCast(movie.actors),

      // Mock reviews
      reviews: generateMockReviews(movie.title),
    };
  };

  // Generate mock cast from actors string
  const generateMockCast = (actorsString) => {
    if (!actorsString) return [];

    const actors = actorsString.split(", ").slice(0, 5);
    const mockImages = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    ];

    return actors.map((actor, index) => ({
      id: index + 1,
      name: actor,
      character: "Main Character",
      image: mockImages[index] || mockImages[0],
      imageAlt: `Portrait of ${actor}`,
    }));
  };

  // Generate mock reviews
  const generateMockReviews = (movieTitle) => {
    const reviews = [
      {
        id: 1,
        userName: "Alex Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        userAvatarAlt: "Profile photo of Alex Martinez",
        rating: Math.floor(Math.random() * 3) + 7,
        date: "2024-12-05",
        comment: `Absolutely brilliant! ${movieTitle} kept me on the edge of my seat from start to finish. The performances were outstanding and the cinematography was breathtaking.`,
        helpful: Math.floor(Math.random() * 200) + 100,
      },
      {
        id: 2,
        userName: "Jessica Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
        userAvatarAlt: "Profile photo of Jessica Lee",
        rating: Math.floor(Math.random() * 4) + 6,
        date: "2024-12-03",
        comment: `A masterpiece of modern cinema. ${movieTitle} combines great storytelling with incredible visuals. Highly recommended!`,
        helpful: Math.floor(Math.random() * 150) + 80,
      },
      {
        id: 3,
        userName: "Robert Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        userAvatarAlt: "Profile photo of Robert Thompson",
        rating: Math.floor(Math.random() * 2) + 8,
        date: "2024-12-01",
        comment: `The attention to detail in ${movieTitle} is remarkable. Every scene feels carefully crafted and meaningful.`,
        helpful: Math.floor(Math.random() * 300) + 150,
      },
    ];

    return reviews;
  };

  const breadcrumbItems = [
    { label: "Home", path: "/movies-listing" },
    { label: "Movies", path: "/movies-listing" },
    { label: movieData?.title || "Movie Details" },
  ];

  if (loading) {
    return (
      <>
        <AppBar onLogout={handleLogout} />
        <div className="main-content">
          <Breadcrumb items={breadcrumbItems} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Hero Skeleton */}
              <div className="skeleton h-96 w-full rounded-lg" />

              {/* Info Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="skeleton h-64 w-full rounded-lg" />
                </div>
                <div className="skeleton h-64 w-full rounded-lg" />
              </div>

              {/* Cast Skeleton */}
              <div className="skeleton h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppBar onLogout={handleLogout} />
        <div className="main-content">
          <Breadcrumb items={breadcrumbItems} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <Icon
              name="AlertCircle"
              size={64}
              className="mx-auto text-error mb-4"
            />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Movie Not Found
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => navigate("/movies-listing")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!movieData) {
    return null;
  }

  const formattedMovieData = formatMovieData(movieData);

  return (
    <>
      <AppBar onLogout={handleLogout} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="main-content bg-background min-h-screen">
        <MovieHero movie={formattedMovieData} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          <MovieInfo movie={formattedMovieData} />
          <CastSection cast={formattedMovieData?.cast} />
          <ReviewSection reviews={formattedMovieData?.reviews} />
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full elevation-4 flex items-center justify-center hover:bg-primary/90 transition-smooth z-50"
          aria-label="Scroll to top"
        >
          <Icon name="ArrowUp" size={24} />
        </button>
      </div>
    </>
  );
};

export default MovieDetails;
