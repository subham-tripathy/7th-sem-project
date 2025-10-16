import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Building,
  Users,
  Target,
  Zap,
  Award,
  Globe,
  ChevronRight,
  TrendingUp,
  Shield,
  Heart,
  Lightbulb,
} from "lucide-react";

export default function About() {
  const [isDark, setIsDark] = useState(false);

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

  // Auto-scroll sections for hero animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Matching",
      description:
        "Our advanced algorithms analyze skills, culture fit, and career aspirations to create perfect matches between talent and opportunities.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Global Talent Network",
      description:
        "Connect with top professionals worldwide through our extensive network of verified candidates and industry-leading companies.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Placement",
      description:
        "Data-driven insights ensure higher success rates, reduced time-to-hire, and better long-term retention for all placements.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trusted Platform",
      description:
        "Enterprise-grade security and privacy protection with verified profiles and comprehensive background screening processes.",
    },
  ];

  const stats = [
    {
      icon: <Building className="w-8 h-8" />,
      number: "10K+",
      label: "Companies",
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "500K+",
      label: "Professionals",
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "95%",
      label: "Success Rate",
    },
    { icon: <Globe className="w-8 h-8" />, number: "50+", label: "Countries" },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Human-Centered",
      description:
        "Technology serves people, not the other way around. Every feature is designed with human needs and experiences at the core.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation First",
      description:
        "We continuously push boundaries, leveraging cutting-edge AI to solve complex challenges in talent acquisition.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Mindset",
      description:
        "We believe in continuous learning and improvement, fostering growth for our users, partners, and our platform.",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
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
        <div
          className={`absolute top-10 right-1/3 w-20 h-20 rounded-full opacity-12 animate-bounce ${
            isDark ? "bg-green-400" : "bg-pink-400"
          }`}
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transform transition-all duration-1000 hover:scale-110 ${
                isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
            >
              <Building className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1
              className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Revolutionizing
              <span
                className={`block bg-gradient-to-r ${
                  isDark
                    ? "from-blue-400 to-purple-400"
                    : "from-blue-600 to-purple-600"
                } bg-clip-text text-transparent`}
              >
                Talent Placement
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              We're building the future of recruitment with AI-powered
              precision, connecting exceptional talent with visionary companies
              worldwide.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative transition-all duration-500 transform hover:scale-105 ${
                  isDark
                    ? "bg-slate-800/60 border-slate-600/50"
                    : "bg-white/70 border-white/20"
                } backdrop-blur-lg rounded-xl shadow-xl border p-6 text-center`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400"
                      : "bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600"
                  }`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`text-3xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  {stat.number}
                </div>
                <div
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className={`relative transition-all duration-500 ${
              isDark
                ? "bg-slate-800/60 border-slate-600/50"
                : "bg-white/70 border-white/20"
            } backdrop-blur-lg rounded-3xl shadow-2xl border p-12`}
          >
            <div className="text-center mb-12">
              <h2
                className={`text-4xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Our Mission
              </h2>
              <p
                className={`text-lg max-w-4xl mx-auto leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                We believe that finding the right opportunity should be
                effortless and finding the right talent should be precise. Our
                AI-powered platform eliminates guesswork, reduces bias, and
                creates meaningful connections that drive success for both
                professionals and organizations. We're not just matching resumes
                to job descriptions – we're building careers and shaping the
                future of work.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-slate-700/40 hover:bg-slate-700/60"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 group-hover:from-blue-500/30 group-hover:to-purple-600/30"
                        : "bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600 group-hover:from-blue-600/20 group-hover:to-purple-600/20"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-6 ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Our Values
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-500 transform hover:scale-105 ${
                  isDark
                    ? "bg-slate-800/60 border-slate-600/50"
                    : "bg-white/70 border-white/20"
                } backdrop-blur-lg rounded-2xl shadow-xl border p-8 text-center`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400"
                      : "bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600"
                  } group-hover:scale-110`}
                >
                  {value.icon}
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  {value.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div
            className={`relative transition-all duration-500 ${
              isDark
                ? "bg-slate-800/60 border-slate-600/50"
                : "bg-white/70 border-white/20"
            } backdrop-blur-lg rounded-3xl shadow-2xl border p-12`}
          >
            <div className="text-center mb-12">
              <h2
                className={`text-4xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Built by Visionaries
              </h2>
              <p
                className={`text-lg max-w-3xl mx-auto leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Our team combines decades of experience in AI, recruitment, and
                technology to create solutions that truly understand the nuances
                of human potential and organizational needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  } flex items-center justify-center`}
                >
                  <Lightbulb className="w-12 h-12 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  AI Research Team
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Machine learning experts from top universities and tech
                  companies
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-pink-600"
                      : "bg-gradient-to-r from-purple-600 to-pink-600"
                  } flex items-center justify-center`}
                >
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  HR Specialists
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Veteran recruiters and talent acquisition professionals
                </p>
              </div>

              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 ${
                    isDark
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600"
                  } flex items-center justify-center`}
                >
                  <Target className="w-12 h-12 text-white" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Product Innovators
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  UX designers and engineers focused on seamless experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className={`relative transition-all duration-500 ${
              isDark
                ? "bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-blue-500/20"
                : "bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-blue-600/20"
            } backdrop-blur-lg rounded-3xl shadow-2xl border p-12`}
          >
            <h2
              className={`text-4xl font-bold mb-6 ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Ready to Transform Your Hiring?
            </h2>
            <p
              className={`text-lg mb-8 max-w-2xl mx-auto ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Join thousands of companies already using our platform to find
              exceptional talent and build stronger teams with AI-powered
              precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                } shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                Get Started Today
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                to="/login"
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? "bg-slate-700/50 text-white border-slate-600 hover:bg-slate-700"
                    : "bg-white/80 text-slate-800 border-slate-300 hover:bg-white"
                } border shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                Sign In
              </Link>
            </div>
          </div>
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
        <div
          className={`absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full animate-ping ${
            isDark ? "bg-green-400" : "bg-pink-500"
          }`}
          style={{ animationDelay: "6s" }}
        ></div>
      </div>
    </div>
  );
}
