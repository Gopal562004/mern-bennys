import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";
import { login } from "../../lib/mongo/services/authService"; // Import your API functions

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Remove mockCredentials since we're using real API
  // const mockCredentials = [...];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData?.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (formData?.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

    // Clear specific field error when user starts typing
    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error when user modifies form
    if (authError) {
      setAuthError("");
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: e?.target?.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setAuthError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the real API login function
      const response = await login(formData.email, formData.password);

      // The login function already stores token and user in localStorage
      // But we can handle additional logic here if needed
      if (formData?.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Redirect based on user role from API response
      const user = response.user;
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/movies-listing");
      }
    } catch (error) {
      // Handle different types of errors
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          setAuthError("Invalid email or password. Please try again.");
        } else if (error.response.status === 400) {
          setAuthError(error.response.data?.message || "Invalid request data.");
        } else if (error.response.status === 500) {
          setAuthError("Server error. Please try again later.");
        } else {
          setAuthError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setAuthError(
          "Network error. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setAuthError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert("Forgot password functionality will be implemented soon.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Icon name="Film" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Movies
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your movie management platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-card rounded-lg elevation-4 p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Global Auth Error */}
            {authError && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-md flex items-start gap-3">
                <Icon
                  name="AlertCircle"
                  size={20}
                  color="var(--color-error)"
                  className="flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-error">{authError}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4">
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleInputChange}
                error={errors?.email}
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData?.password}
                onChange={handleInputChange}
                error={errors?.password}
                required
                disabled={loading}
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Checkbox
                label="Remember me"
                checked={formData?.rememberMe}
                onChange={handleCheckboxChange}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* You can remove the mock credentials section or keep it with updated instructions */}
          <div className="mt-6 p-4 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground font-medium mb-2">
              Note: This form now uses real API authentication
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Enter your registered email and password to sign in.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date()?.getFullYear()} CineHub Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
