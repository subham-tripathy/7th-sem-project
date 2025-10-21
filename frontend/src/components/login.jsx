import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, Mail, X, Send } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom"
import { backendURL } from "./functions";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth();
  if (user) {
    navigate("/")
  }
  const [id, setid] = useState("");
  const [pw, setpw] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id == "") {
      toast.error("Enter ID");
      return;
    }
    if (pw == "") {
      toast.error("Enter Password");
      return;
    }

    fetch(`${backendURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        pw: pw,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "error") {
          toast.error(data.message)
          return
        }
        if (data.status == "success") {
          login(data.token)
          toast.success("Logged in successful");
        }
      })
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsResetLoading(true);

    try {
      const response = await fetch(`${backendURL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
        }),
      });

      const data = await response.json();

      toast.success("Password reset link sent to your email!");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsResetLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

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

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDark
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-pulse ${isDark ? "bg-blue-400" : "bg-blue-400"
            }`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-24 h-24 rounded-full opacity-15 animate-bounce ${isDark ? "bg-purple-400" : "bg-indigo-400"
            }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-10 w-16 h-16 rounded-full opacity-20 animate-pulse ${isDark ? "bg-cyan-400" : "bg-purple-400"
            }`}
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Login Form Container */}
      <div
        className={`relative w-full max-w-md mx-auto transition-all duration-500 ${isDark
          ? "bg-slate-800/90 border-slate-600/50"
          : "bg-white/90 border-white/20"
          } backdrop-blur-lg rounded-2xl shadow-2xl border p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark
              ? "bg-gradient-to-r from-blue-500 to-purple-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
          >
            <User className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"
              }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"
              }`}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* ID Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                }`}
            >
              User ID / Email
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === "id"
                  ? isDark
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                  }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={id}
                onChange={(e) => setid(e.target.value)}
                onFocus={() => setFocusedField("id")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ${isDark
                  ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                  : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Enter your ID or email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                }`}
            >
              Password
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${focusedField === "password"
                  ? isDark
                    ? "text-blue-400"
                    : "text-blue-600"
                  : isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                  }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={pw}
                onChange={(e) => setpw(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-300 ${isDark
                  ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                  : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-600"
                  } transition-colors duration-200`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <Link
              to={"/register"}
              className={`invisible font-medium transition-colors duration-200 ${isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
                }`}
            >
              Create New Account
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70 ${isDark
              ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              } shadow-lg hover:shadow-xl disabled:hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-md mx-auto transition-all duration-300 ${isDark
              ? "bg-slate-800/95 border-slate-600/50"
              : "bg-white/95 border-white/20"
              } backdrop-blur-lg rounded-2xl shadow-2xl border p-6`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-800"
                  }`}
              >
                Reset Password
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                }}
                className={`p-2 rounded-lg transition-colors duration-200 ${isDark
                  ? "hover:bg-slate-700 text-slate-400 hover:text-slate-300"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-600"
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p
                className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"
                  }`}
              >
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ${isDark
                      ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                      : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                      } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your email address"
                    disabled={isResetLoading}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  disabled={isResetLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isDark
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                    } disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={isResetLoading || !resetEmail}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 ${isDark
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                    } shadow-lg hover:shadow-xl disabled:hover:shadow-lg disabled:cursor-not-allowed`}
                >
                  {isResetLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-ping ${isDark ? "bg-blue-400" : "bg-blue-500"
            }`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className={`absolute top-3/4 right-1/4 w-2 h-2 rounded-full animate-ping ${isDark ? "bg-purple-400" : "bg-purple-500"
            }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 w-1 h-1 rounded-full animate-ping ${isDark ? "bg-cyan-400" : "bg-indigo-500"
            }`}
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
}
