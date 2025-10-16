import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Building,
  Hash,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function SignUpForm() {
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  // Real-time validation
  useEffect(() => {
    const errors = {};

    if (companyName && companyName.length < 2) {
      errors.companyName = "Company name must be at least 2 characters";
    }

    if (companyId && companyId.length < 3) {
      errors.companyId = "Company ID must be at least 3 characters";
    }

    if (companyEmail && !validateEmail(companyEmail)) {
      errors.companyEmail = "Please enter a valid email address";
    }

    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
  }, [companyName, companyId, companyEmail, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !companyId || !companyEmail || !password) {
      return; // Form validation will show errors
    }

    if (Object.keys(validationErrors).length > 0) {
      return; // Don't submit if there are validation errors
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Company registered:", {
        companyName,
        companyId,
        companyEmail,
      });
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return isDark ? "bg-red-500" : "bg-red-500";
    if (passwordStrength <= 50)
      return isDark ? "bg-orange-500" : "bg-orange-500";
    if (passwordStrength <= 75)
      return isDark ? "bg-yellow-500" : "bg-yellow-500";
    return isDark ? "bg-green-500" : "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-pulse ${
            isDark ? "bg-blue-400" : "bg-blue-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-24 h-24 rounded-full opacity-15 animate-bounce ${
            isDark ? "bg-purple-400" : "bg-indigo-400"
          }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-10 w-16 h-16 rounded-full opacity-20 animate-pulse ${
            isDark ? "bg-cyan-400" : "bg-purple-400"
          }`}
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Sign Up Form Container */}
      <div
        className={`relative w-full max-w-lg mx-auto transition-all duration-500 ${
          isDark
            ? "bg-slate-800/90 border-slate-600/50"
            : "bg-white/90 border-white/20"
        } backdrop-blur-lg rounded-2xl shadow-2xl border p-8`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isDark
                ? "bg-gradient-to-r from-blue-500 to-purple-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Company Registration
          </h1>
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Join our AI-powered placement platform
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Company Name Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Company Name
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  focusedField === "companyName"
                    ? isDark
                      ? "text-blue-400"
                      : "text-blue-600"
                    : isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                <Building className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onFocus={() => setFocusedField("companyName")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ${
                  validationErrors.companyName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                    : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Enter company name"
              />
              {companyName && !validationErrors.companyName && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.companyName && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.companyName}
              </div>
            )}
          </div>

          {/* Company ID Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Company ID
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  focusedField === "companyId"
                    ? isDark
                      ? "text-blue-400"
                      : "text-blue-600"
                    : isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                <Hash className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                onFocus={() => setFocusedField("companyId")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ${
                  validationErrors.companyId
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                    : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Enter unique company ID"
              />
              {companyId && !validationErrors.companyId && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.companyId && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.companyId}
              </div>
            )}
          </div>

          {/* Company Email Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Company Email
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  focusedField === "companyEmail"
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
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                onFocus={() => setFocusedField("companyEmail")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300 ${
                  validationErrors.companyEmail
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                    : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="company@example.com"
              />
              {companyEmail && !validationErrors.companyEmail && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {validationErrors.companyEmail && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.companyEmail}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  focusedField === "password"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-300 ${
                  validationErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : isDark
                    ? "bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
                    : "bg-white/80 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:bg-white"
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-600"}
                  >
                    Password strength
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength <= 25
                        ? "text-red-500"
                        : passwordStrength <= 50
                        ? "text-orange-500"
                        : passwordStrength <= 75
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div
                  className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDark ? "bg-slate-600" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {validationErrors.password && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.password}
              </div>
            )}
          </div>

          {/* Already have account link */}
          <div className="flex justify-center">
            <Link
              to={"/login"}
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Already have an account? Sign In
            </Link>
          </div>

          {/* Register Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              Object.keys(validationErrors).length > 0 ||
              !companyName ||
              !companyId ||
              !companyEmail ||
              !password
            }
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed ${
              isDark
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            } shadow-lg hover:shadow-xl disabled:hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Company Account"
            )}
          </button>
        </div>

      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-ping ${
            isDark ? "bg-blue-400" : "bg-blue-500"
          }`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className={`absolute top-3/4 right-1/4 w-2 h-2 rounded-full animate-ping ${
            isDark ? "bg-purple-400" : "bg-purple-500"
          }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute top-1/2 right-1/3 w-1 h-1 rounded-full animate-ping ${
            isDark ? "bg-cyan-400" : "bg-indigo-500"
          }`}
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  );
}
