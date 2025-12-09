import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/AppBar";
import Breadcrumb from "../../components/Breadcrumb";
import FormHeader from "./components/FormHeader";
import MovieForm from "./components/MovieForm";
import ConfirmationDialog from "./components/ConfirmationDialog";
import SuccessNotification from "./components/SuccessNotification";
import { createMovie } from "../../lib/mongo/services/movieService";

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [posterPreview, setPosterPreview] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    releaseDate: "",
    duration: "",
    genre: "",
    poster: null,
    director: "",
    actors: "",
    imdbId: "",
    language: "English",
    country: "",
  });

  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    const isFormFilled = Object.values(formData)?.some(
      (value) => value !== "" && value !== null
    );
    setHasUnsavedChanges(isFormFilled);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = "Movie title is required";
    } else if (formData?.title?.trim()?.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData?.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData?.description?.trim()?.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData?.rating) {
      newErrors.rating = "Rating is required";
    } else if (
      isNaN(formData.rating) ||
      formData.rating < 0 ||
      formData.rating > 10
    ) {
      newErrors.rating = "Rating must be a number between 0 and 10";
    }

    if (!formData?.releaseDate) {
      newErrors.releaseDate = "Release date is required";
    } else {
      const selectedDate = new Date(formData.releaseDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.releaseDate = "Release date cannot be in the future";
      }
    }

    if (!formData?.duration) {
      newErrors.duration = "Duration is required";
    } else if (formData?.duration < 1 || formData?.duration > 500) {
      newErrors.duration = "Duration must be between 1 and 500 minutes";
    }

    if (!formData?.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!formData?.director?.trim()) {
      newErrors.director = "Director is required";
    }

    if (!formData?.actors?.trim()) {
      newErrors.actors = "Actors are required";
    }

    if (formData?.imdbId && !formData?.imdbId?.startsWith("tt")) {
      newErrors.imdbId = "IMDb ID should start with 'tt'";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e?.target?.files?.[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes?.includes(file?.type)) {
        setErrors((prev) => ({
          ...prev,
          poster: "Please upload a valid image file (JPG, PNG, or WebP)",
        }));
        return;
      }

      if (file?.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          poster: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        poster: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader?.result);
      };
      reader?.readAsDataURL(file);

      if (errors?.poster) {
        setErrors((prev) => ({
          ...prev,
          poster: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          if (key === "poster" && formData[key] instanceof File) {
            formDataToSend.append("poster", formData[key]);
          } else if (key === "duration" || key === "rating") {
            formDataToSend.append(key, parseFloat(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Add required fields that might be missing from formData
      if (!formDataToSend.has("language")) {
        formDataToSend.append("language", "English");
      }

      // Call API to create movie
      await createMovie(formDataToSend);

      setLoading(false);
      setShowSuccessNotification(true);

      // Clear form
      setFormData({
        title: "",
        description: "",
        rating: "",
        releaseDate: "",
        duration: "",
        genre: "",
        poster: null,
        director: "",
        actors: "",
        imdbId: "",
        language: "English",
        country: "",
      });
      setPosterPreview(null);

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error adding movie:", error);
      setLoading(false);

      setSnackbar({
        show: true,
        message: error.response?.data?.message || "Failed to add movie",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      navigate("/admin-dashboard");
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const breadcrumbItems = [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Add Movie" },
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

      <div className="main-content">
        <Breadcrumb items={breadcrumbItems} />

        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <FormHeader />

          <div className="bg-card rounded-lg border border-border p-6 md:p-8 elevation-2">
            <MovieForm
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              posterPreview={posterPreview}
              onPosterChange={handlePosterChange}
              mode="add"
            />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmDialog(false)}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to leave this page? All your changes will be lost."
      />

      <SuccessNotification
        isVisible={showSuccessNotification}
        message="Movie added successfully!"
        onClose={() => setShowSuccessNotification(false)}
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

export default AddMovie;
