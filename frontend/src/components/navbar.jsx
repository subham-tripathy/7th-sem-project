import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Home,
  Info,
  LogOut,
  Brain,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setInterval(() => {
      const storedUser = localStorage.getItem("placementHubUser");
      if (storedUser) {
        setUser(storedUser);
      }
    }, 500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("placementHubUser");
    setUser(null);
  };
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
  ];
  return (
    <nav
      className={`h-16 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? "bg-slate-900/95 backdrop-blur-lg border-slate-700/50 shadow-2xl"
            : "bg-white/95 backdrop-blur-lg border-slate-200/50 shadow-2xl"
          : isDark
          ? "bg-slate-800/90 backdrop-blur-md border-slate-700/30"
          : "bg-white/90 backdrop-blur-md border-slate-200/30"
      } border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div
              className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <button
                className={`text-xl font-bold transition-colors duration-300 ${
                  isDark
                    ? "text-white hover:text-blue-400"
                    : "text-slate-800 hover:text-blue-600"
                }`}
              >
                AI Powered Placement Hub
              </button>
              <span
                className={`text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Smart Career Connections
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  to={item.path}
                  key={item.name}
                  style={{ textDecoration: "none" }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                      isDark
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                    } shadow-lg hover:shadow-xl`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{jwtDecode(user).name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      isDark
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to={"/login"}
                style={{ textDecoration: "none" }}
                className={` flex items-center space-x-2 px-6 py-2 transition-all duration-300 hover:scale-105 transform ${
                  isDark
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
                } shadow-lg hover:shadow-xl`}
              >
                <User className="w-4 h-4" />
                <span
                  style={{ textDecoration: "none" }}
                  className="text-white font-medium"
                >
                  Sign In
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDark
                  ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="space-y-3 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              {user ? (
                <div className="space-y-3">
                  <button
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${
                      isDark
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{jwtDecode(user).name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg border-2 ${
                      isDark
                        ? "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
