import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { GraduationCap, Users, TrendingUp, Zap, Sun, Moon } from "lucide-react";

export default function HeroSection() {
  const [isDark, setIsDark] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${isDark
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse ${isDark ? "bg-purple-400" : "bg-blue-400"
            }`}
        ></div>
        <div
          className={`absolute top-40 right-32 w-24 h-24 rounded-full opacity-30 animate-bounce ${isDark ? "bg-pink-400" : "bg-indigo-400"
            }`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute bottom-32 left-32 w-20 h-20 rounded-full opacity-25 animate-pulse ${isDark ? "bg-cyan-400" : "bg-purple-400"
            }`}
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-28 h-28 rounded-full opacity-20 animate-bounce ${isDark ? "bg-emerald-400" : "bg-rose-400"
            }`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <GraduationCap
            className={`absolute top-32 left-16 w-8 h-8 opacity-60 animate-float ${isDark ? "text-blue-400" : "text-blue-600"
              }`}
            style={{ animationDelay: "0s" }}
          />
          <Users
            className={`absolute top-48 right-24 w-6 h-6 opacity-60 animate-float ${isDark ? "text-purple-400" : "text-purple-600"
              }`}
            style={{ animationDelay: "1s" }}
          />
          <TrendingUp
            className={`absolute bottom-48 left-24 w-7 h-7 opacity-60 animate-float ${isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
            style={{ animationDelay: "2s" }}
          />
          <Zap
            className={`absolute bottom-32 right-16 w-6 h-6 opacity-60 animate-float ${isDark ? "text-yellow-400" : "text-orange-600"
              }`}
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Hero Content */}
        <div
          className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 ${isDark
              ? "bg-purple-800/50 text-purple-200 border border-purple-600/50"
              : "bg-white/80 text-blue-700 border border-blue-200 shadow-lg"
              } backdrop-blur-sm`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Revolutionizing Student-to-Career Connections
          </div>

          {/* Main Heading */}
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${isDark ? "text-white" : "text-slate-800"
              }`}
          >
            Where{" "}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark
                ? "from-blue-400 via-purple-400 to-pink-400"
                : "from-blue-600 via-purple-600 to-indigo-600"
                }`}
            >
              Student Data
            </span>
            <br />
            Meets{" "}
            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${isDark
                ? "from-emerald-400 via-cyan-400 to-blue-400"
                : "from-emerald-600 via-teal-600 to-blue-600"
                }`}
            >
              Intelligent Hiring
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"
              }`}
          >
            Connect talented students with forward-thinking employers through
            AI-powered matching and comprehensive academic insights.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={"/register"}
              style={{ textDecoration: "none" }}
              className="text-white relative z-10 flex items-center"
            >
              <span
                className={`group relative px-8 py-4 font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
                  } shadow-xl`}
              >
                Get Started
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </Link>

            <Link
              to={"/about"}
              className={`px-8 py-4 font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 ${isDark
                ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                }`}
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto ${isDark ? "text-white" : "text-slate-700"
              }`}
          >
            <div className="text-center">
              <div
                className={`text-3xl font-bold mb-2 ${isDark ? "text-blue-400" : "text-blue-600"
                  }`}
              >
                50K+
              </div>
              <div className="text-sm opacity-80">Students Connected</div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold mb-2 ${isDark ? "text-purple-400" : "text-purple-600"
                  }`}
              >
                2K+
              </div>
              <div className="text-sm opacity-80">Partner Companies</div>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
              >
                95%
              </div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
}
