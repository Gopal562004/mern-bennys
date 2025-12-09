import React from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";

const MovieForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  loading,
  posterPreview,
  onPosterChange,
  mode = "add", // "add" or "edit"
}) => {
  // Updated genre options based on your MongoDB schema
  const genreOptions = [
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Animation", label: "Animation" },
    { value: "Biography", label: "Biography" },
    { value: "Comedy", label: "Comedy" },
    { value: "Crime", label: "Crime" },
    { value: "Documentary", label: "Documentary" },
    { value: "Drama", label: "Drama" },
    { value: "Family", label: "Family" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Film-Noir", label: "Film Noir" },
    { value: "History", label: "History" },
    { value: "Horror", label: "Horror" },
    { value: "Music", label: "Music" },
    { value: "Musical", label: "Musical" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Science Fiction" },
    { value: "Sport", label: "Sport" },
    { value: "Thriller", label: "Thriller" },
    { value: "War", label: "War" },
    { value: "Western", label: "Western" },
  ];

  // Language options
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
    { value: "Arabic", label: "Arabic" },
    { value: "Russian", label: "Russian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Other", label: "Other" },
  ];

  // Common countries
  const countryOptions = [
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    { value: "India", label: "India" },
    { value: "Japan", label: "Japan" },
    { value: "South Korea", label: "South Korea" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "Italy", label: "Italy" },
    { value: "Spain", label: "Spain" },
    { value: "China", label: "China" },
    { value: "Russia", label: "Russia" },
    { value: "Brazil", label: "Brazil" },
    { value: "Mexico", label: "Mexico" },
    { value: "Other", label: "Other" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Movie Title"
            type="text"
            name="title"
            placeholder="Enter movie title"
            value={formData?.title || ""}
            onChange={onChange}
            error={errors?.title}
            required
            description="The official title of the movie"
            disabled={loading}
          />

          <Input
            label="IMDb ID"
            type="text"
            name="imdbId"
            placeholder="tt0111161"
            value={formData?.imdbId || ""}
            onChange={onChange}
            error={errors?.imdbId}
            description="IMDb identifier (e.g., tt0111161)"
            disabled={loading}
          />
        </div>

        {/* Use Input for description instead of Textarea */}
        <div className="lg:col-span-2">
          <Input
            label="Description"
            type="text"
            name="description"
            placeholder="Enter movie description"
            value={formData?.description || ""}
            onChange={onChange}
            error={errors?.description}
            required
            description="A brief synopsis of the movie plot"
            disabled={loading}
            multiline // Add this prop if your Input component supports multiline
            rows={4} // Add rows prop for multiline input
          />
        </div>

        <Input
          label="Rating"
          type="number"
          name="rating"
          placeholder="8.5"
          value={formData?.rating || ""}
          onChange={onChange}
          error={errors?.rating}
          required
          min="0"
          max="10"
          step="0.1"
          description="IMDb rating (0-10)"
          disabled={loading}
        />

        <Input
          label="Release Date"
          type="date"
          name="releaseDate"
          value={formData?.releaseDate || ""}
          onChange={onChange}
          error={errors?.releaseDate}
          required
          description="Official release date"
          disabled={loading}
        />

        <Input
          label="Duration (minutes)"
          type="number"
          name="duration"
          placeholder="142"
          value={formData?.duration || ""}
          onChange={onChange}
          error={errors?.duration}
          required
          min="1"
          max="500"
          description="Total runtime in minutes"
          disabled={loading}
        />

        <Select
          label="Genre"
          name="genre"
          options={genreOptions}
          value={formData?.genre || ""}
          onChange={(value) => onChange({ target: { name: "genre", value } })}
          error={errors?.genre}
          required
          placeholder="Select primary genre"
          searchable
          description="Primary genre classification"
          disabled={loading}
        />

        {/* Cast & Crew */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Director"
            type="text"
            name="director"
            placeholder="Enter director's name"
            value={formData?.director || ""}
            onChange={onChange}
            error={errors?.director}
            required
            description="Movie director"
            disabled={loading}
          />

          <Input
            label="Actors"
            type="text"
            name="actors"
            placeholder="Actor 1, Actor 2, Actor 3"
            value={formData?.actors || ""}
            onChange={onChange}
            error={errors?.actors}
            required
            description="Main actors (comma separated)"
            disabled={loading}
          />
        </div>

        {/* Additional Information */}
        <Select
          label="Language"
          name="language"
          options={languageOptions}
          value={formData?.language || "English"}
          onChange={(value) =>
            onChange({ target: { name: "language", value } })
          }
          error={errors?.language}
          required
          placeholder="Select language"
          description="Primary language of the movie"
          disabled={loading}
        />

        <Select
          label="Country"
          name="country"
          options={countryOptions}
          value={formData?.country || "United States"}
          onChange={(value) => onChange({ target: { name: "country", value } })}
          error={errors?.country}
          required
          placeholder="Select country"
          description="Country of origin"
          disabled={loading}
        />

        {/* Additional fields based on your schema */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Production Company (Optional)"
            type="text"
            name="production"
            placeholder="Warner Bros. Pictures"
            value={formData?.production || ""}
            onChange={onChange}
            error={errors?.production}
            description="Production company name"
            disabled={loading}
          />

          <Input
            label="Budget (Optional)"
            type="text"
            name="budget"
            placeholder="$185 million"
            value={formData?.budget || ""}
            onChange={onChange}
            error={errors?.budget}
            description="Movie production budget"
            disabled={loading}
          />
        </div>
      </div>

      {/* Poster Upload Section */}
      <div className="border-t border-border pt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Movie Poster{" "}
            {mode === "add" && <span className="text-error">*</span>}
          </label>
          <p className="text-sm text-muted-foreground">
            {mode === "add"
              ? "Upload a high-quality poster image (JPG, PNG, WebP - Max 5MB)"
              : "Poster cannot be changed in edit mode. Delete and re-add the movie to change poster."}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Input
              type="file"
              name="poster"
              onChange={onPosterChange}
              error={errors?.poster}
              accept="image/jpeg,image/png,image/webp"
              description={
                mode === "add"
                  ? "Supported formats: JPG, PNG, WebP"
                  : "Disabled in edit mode"
              }
              disabled={loading || mode === "edit"}
            />
          </div>

          {(posterPreview || formData?.poster) && (
            <div className="w-full md:w-48 h-64 rounded-lg overflow-hidden border-2 border-border bg-muted">
              <img
                src={posterPreview || formData?.poster}
                alt="Movie poster preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1595769812729-76e01f8df4a3?w=200&h=300&fit=crop";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
        <Button
          type="submit"
          variant="default"
          loading={loading}
          iconName="Save"
          iconPosition="left"
          className="sm:flex-1"
        >
          {mode === "add" ? "Add Movie" : "Update Movie"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          iconName="X"
          iconPosition="left"
          className="sm:flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;
