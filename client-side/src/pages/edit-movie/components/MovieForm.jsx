import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const MovieForm = ({ movie, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    releaseDate: "",
    duration: "",
    genre: "",
    poster: "",
  });
  const [posterPreview, setposterPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [posterFile, setposterFile] = useState(null);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie?.title || "",
        description: movie?.description || "",
        rating: movie?.rating || "",
        releaseDate: movie?.releaseDate || "",
        duration: movie?.duration || "",
        genre: movie?.genre || "",
        poster: movie?.poster || "",
      });
      setposterPreview(movie?.poster || "");
    }
  }, [movie]);

  const genreOptions = [
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "romance", label: "Romance" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "thriller", label: "Thriller" },
    { value: "documentary", label: "Documentary" },
    { value: "animation", label: "Animation" },
    { value: "fantasy", label: "Fantasy" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = "Movie title is required";
    } else if (formData?.title?.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData?.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (formData?.description?.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData?.rating) {
      newErrors.rating = "Rating is required";
    } else if (
      parseFloat(formData?.rating) < 0 ||
      parseFloat(formData?.rating) > 10
    ) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    if (!formData?.releaseDate) {
      newErrors.releaseDate = "Release date is required";
    }

    if (!formData?.duration) {
      newErrors.duration = "Duration is required";
    } else if (parseInt(formData?.duration) < 1) {
      newErrors.duration = "Duration must be at least 1 minute";
    }

    if (!formData?.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!posterPreview) {
      newErrors.poster = "Movie poster is required";
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

  const handleGenreChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      genre: value,
    }));
    if (errors?.genre) {
      setErrors((prev) => ({
        ...prev,
        genre: "",
      }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          poster: "File size must be less than 5MB",
        }));
        return;
      }

      if (!file?.type?.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          poster: "Please upload a valid image file",
        }));
        return;
      }

      setposterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setposterPreview(reader?.result);
        setFormData((prev) => ({
          ...prev,
          poster: reader?.result,
        }));
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

  const handleRemovePoster = () => {
    setposterPreview("");
    setposterFile(null);
    setFormData((prev) => ({
      ...prev,
      poster: "",
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Movie Title"
            type="text"
            name="title"
            placeholder="Enter movie title"
            value={formData?.title}
            onChange={handleInputChange}
            error={errors?.title}
            required
            disabled={loading}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter movie description"
              value={formData?.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={6}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            {errors?.description && (
              <p className="mt-1 text-sm text-error">{errors?.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Rating"
              type="number"
              name="rating"
              placeholder="0.0"
              value={formData?.rating}
              onChange={handleInputChange}
              error={errors?.rating}
              required
              disabled={loading}
              min="0"
              max="10"
              step="0.1"
            />

            <Input
              label="Duration (minutes)"
              type="number"
              name="duration"
              placeholder="120"
              value={formData?.duration}
              onChange={handleInputChange}
              error={errors?.duration}
              required
              disabled={loading}
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Release Date"
              type="date"
              name="releaseDate"
              value={formData?.releaseDate}
              onChange={handleInputChange}
              error={errors?.releaseDate}
              required
              disabled={loading}
            />

            <Select
              label="Genre"
              options={genreOptions}
              value={formData?.genre}
              onChange={handleGenreChange}
              error={errors?.genre}
              placeholder="Select genre"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Movie Poster <span className="text-error">*</span>
          </label>

          {posterPreview ? (
            <div className="relative bg-muted rounded-lg overflow-hidden border-2 border-border">
              <div className="aspect-[2/3] w-full">
                <Image
                  src={posterPreview}
                  alt="Movie poster preview showing uploaded image for editing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <label className="cursor-pointer bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-smooth elevation-2">
                  <Icon name="Upload" size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleRemovePoster}
                  disabled={loading}
                  className="bg-error text-error-foreground p-2 rounded-md hover:bg-error/90 transition-smooth elevation-2"
                >
                  <Icon name="Trash2" size={20} />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-[2/3] border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-smooth">
              <div className="flex flex-col items-center justify-center py-8">
                <Icon
                  name="Upload"
                  size={48}
                  className="text-muted-foreground mb-4"
                />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload poster
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          )}

          {errors?.poster && (
            <p className="text-sm text-error">{errors?.poster}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <Button
          type="submit"
          variant="default"
          loading={loading}
          disabled={loading}
          iconName="Save"
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          Update Movie
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          iconName="X"
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;
