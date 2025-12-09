import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./AppIcon";
import { logout } from "../lib/mongo/services/authService";

const AppBar = ({ onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");

  // Get user from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setUserRole(userData?.role || "user");
        } else {
          setUser(null);
          setUserRole("user");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
        setUserRole("user");
      }
    };

    getUserFromStorage();

    // Listen for storage events
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "authToken") {
        getUserFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isActive = (path) => location?.pathname === path;

  // Navigation items based on roles
  const navigationItems = [
    // User role navigation (visible to both users and admins)
    {
      label: "Movies",
      path: "/movies-listing",
      icon: "Film",
      roles: ["user", "admin"],
      description: "Browse all movies",
    },
    // Admin role navigation (only for admins)
    {
      label: "Dashboard",
      path: "/admin-dashboard",
      icon: "LayoutDashboard",
      roles: ["admin"],
      description: "Admin overview",
    }
  ];

  // Filter navigation items based on user role
  const visibleNavItems = navigationItems?.filter((item) =>
    item?.roles?.includes(userRole)
  );

  const handleLogout = () => {
    // Call logout function
    logout();

    // Clear state
    setUser(null);
    setUserRole("user");

    // Call parent logout handler if provided
    if (onLogout) {
      onLogout();
    }

    // Close mobile menu
    setMobileMenuOpen(false);

    // Navigate to login page
    navigate("/login");
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Get user initials from MongoDB user data
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Get user role display name
  const getUserRoleDisplay = () => {
    switch (userRole) {
      case "admin":
        return "Administrator";
      case "user":
        return "Member";
      default:
        return "User";
    }
  };

  // Format user name (capitalize first letters)
  const getUserDisplayName = () => {
    if (!user?.name) return "User";
    return user.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    return !!(token && userStr);
  };

  // If not authenticated and not on login/register pages, don't show AppBar
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );
  if (!isAuthenticated() && !isAuthPage) {
    return null;
  }

  return (
    <>
      <header className="app-bar">
        <div className="app-bar-container">
          {/* Logo */}
          <Link
            to={
              isAuthenticated()
                ? userRole === "admin"
                  ? "/admin-dashboard"
                  : "/movies-listing"
                : "/"
            }
            className="app-bar-logo"
          >
            <Icon name="Film" size={28} />
            <div className="flex flex-col">
              <span className="font-bold">Movies</span>
              <span className="text-xs text-muted-foreground">
                {isAuthenticated()
                  ? userRole === "admin"
                    ? "Admin Panel"
                    : "Movies"
                  : "Welcome"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated() && (
            <nav className="app-bar-nav">
              {visibleNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`app-bar-nav-item ${
                    isActive(item?.path) ? "active" : ""
                  }`}
                  title={item?.description}
                >
                  {item?.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User Actions */}
          <div className="app-bar-actions">
            {isAuthenticated() ? (
              <>
                {user && (
                  <div className="app-bar-user">
                    <div
                      className="app-bar-avatar"
                      title={getUserRoleDisplay()}
                    >
                      {getUserInitials()}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {getUserDisplayName()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getUserRoleDisplay()}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-smooth flex items-center gap-2"
                  aria-label="Logout"
                  title="Logout"
                >
                  <Icon name="LogOut" size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="app-bar-menu-button"
                  aria-label="Open menu"
                >
                  <Icon name="Menu" size={24} />
                </button>
              </>
            ) : (
              // Show auth buttons if not authenticated
              !isAuthPage && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-smooth"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? "" : "closed"}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      {/* Mobile Drawer */}
      {isAuthenticated() && (
        <aside className={`mobile-drawer ${mobileMenuOpen ? "" : "closed"}`}>
          <div className="mobile-drawer-header">
            <Link
              to={userRole === "admin" ? "/admin-dashboard" : "/movies-listing"}
              className="app-bar-logo"
              onClick={handleNavClick}
            >
              <Icon name="Film" size={28} />
              <span>CineHub {userRole === "admin" ? "Admin" : ""}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-drawer-close"
              aria-label="Close menu"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <nav className="mobile-drawer-nav">
            {/* User Profile Section */}
            {user && (
              <div className="mobile-drawer-profile">
                <div className="app-bar-avatar large">{getUserInitials()}</div>
                <div className="flex flex-col">
                  <span className="font-medium">{getUserDisplayName()}</span>
                  <span className="text-sm text-muted-foreground">
                    {user?.email}
                  </span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full mt-1 inline-block w-fit">
                    {getUserRoleDisplay()}
                  </span>
                </div>
              </div>
            )}

            <div className="mobile-drawer-divider" />

            {/* Navigation Items */}
            {visibleNavItems?.length > 0 && (
              <>
                <div className="mobile-drawer-section-label">
                  {userRole === "admin" ? "Admin Menu" : "Menu"}
                </div>
                {visibleNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`mobile-drawer-nav-item ${
                      isActive(item?.path) ? "active" : ""
                    }`}
                    onClick={handleNavClick}
                    title={item?.description}
                  >
                    <Icon name={item?.icon} size={20} />
                    <div className="flex flex-col">
                      <span>{item?.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item?.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </>
            )}

            <div className="mobile-drawer-divider" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mobile-drawer-nav-item text-error hover:bg-error/10"
            >
              <Icon name="LogOut" size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>
      )}
    </>
  );
};

export default AppBar;
