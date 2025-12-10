import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin-dashboard";
import Login from "./pages/login";
import MovieDetails from "./pages/movie-details";
import MoviesListing from "./pages/movies-listing";
import EditMovie from "./pages/edit-movie";
import AddMovie from "./pages/add-movie";

const Routes = () => {
  // ✅ FIXED: Handle null/undefined safely
  const getUser = () => {
    try {
      const userData = localStorage.getItem("user");
      // Check if data exists and is not "null" or "undefined" string
      if (!userData || userData === "null" || userData === "undefined") {
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data from localStorage
      localStorage.removeItem("user");
      return null;
    }
  };

  const user = getUser();
  const isAdminLoggedIn = user?.role === "admin";

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* This will now work for new users */}
          <Route path="/" element={<Navigate to="/movies-listing" />} />

          {/* Public routes - accessible without login */}
          <Route path="/login" element={<Login />} />
          <Route path="/movies-listing" element={<MoviesListing />} />
          <Route path="/movie-details/:slug" element={<MovieDetails />} />

          {/* Admin protected routes - requires login */}
          <Route
            path="/admin-dashboard"
            element={
              isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/edit-movie/:slug"
            element={isAdminLoggedIn ? <EditMovie /> : <Navigate to="/login" />}
          />

          <Route
            path="/add-movie"
            element={isAdminLoggedIn ? <AddMovie /> : <Navigate to="/login" />}
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
