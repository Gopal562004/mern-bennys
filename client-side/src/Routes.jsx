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
  const getUser = () => {
    try {
      const userString = localStorage.getItem("user");
      // Check if it's null or undefined
      if (!userString || userString === "null" || userString === "undefined") {
        return null;
      }
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
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
          {/* redirect / */}
          <Route path="/" element={<Navigate to="/movies-listing" />} />

          {/* public */}
          <Route path="/login" element={<Login />} />
          <Route path="/movies-listing" element={<MoviesListing />} />
          <Route path="/movie-details/:slug" element={<MovieDetails />} />

          {/* admin protected */}
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

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
