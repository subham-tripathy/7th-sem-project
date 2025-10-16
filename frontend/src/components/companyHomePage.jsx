import { useState, useEffect } from "react";
import {
  Building2,
  Filter,
  Plus,
  Download,
  UserCheck,
  Award,
  MapPin,
  Star,
  Upload,
  Settings,
  Sparkles,
  Save,
  X,
} from "lucide-react";

export default function CompanyDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const aiRecommendedCandidates = [
    {
      id: 1,
      name: "Ananya Patel",
      matchScore: 95,
      college: "IIT Bombay",
      cgpa: 9.2,
      skills: ["React", "Node.js", "Python", "AWS"],
      resumeUrl: "#",
      shortlisted: false,
    },
    {
      id: 2,
      name: "Vikram Singh",
      matchScore: 92,
      college: "BITS Pilani",
      cgpa: 8.9,
      skills: ["Java", "Spring Boot", "Docker", "Kubernetes"],
      resumeUrl: "#",
      shortlisted: false,
    },
    {
      id: 3,
      name: "Priya Sharma",
      matchScore: 88,
      college: "IIT Delhi",
      cgpa: 9.0,
      skills: ["Python", "Django", "PostgreSQL", "Redis"],
      resumeUrl: "#",
      shortlisted: true,
    },
  ];

  const features = [
    {
      title: "Create Job Posting",
      func: () => {
        setShowJobPostModal(true);
      },
      icon: Plus,
      color: isDark ? "from-blue-400 to-blue-600" : "from-blue-500 to-blue-700",
    },
    {
      title: "AI Recommended",
      func: () => {
        setActiveTab("candidates");
      },
      icon: Sparkles,
      color: isDark
        ? "from-emerald-400 to-emerald-600"
        : "from-emerald-500 to-emerald-700",
    },
    {
      title: "Shortlisted",
      func: () => {
        setActiveTab("shortlisted");
      },
      icon: UserCheck,
      color: isDark
        ? "from-purple-400 to-purple-600"
        : "from-purple-500 to-purple-700",
    },
    {
      title: "Offers Released",
      func: () => {
        setActiveTab("results");
      },
      icon: Award,
      color: isDark
        ? "from-orange-400 to-orange-600"
        : "from-orange-500 to-orange-700",
    },
  ];

  const tabContent = {
    overview: "Overview",
    jobs: "Job Postings",
    candidates: "AI Recommendations",
    shortlisted: "Shortlisted",
    results: "Drive Results",
    profile: "Company Profile",
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-all duration-300 ${
          isDark
            ? "bg-slate-800/90 border-slate-700"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-xl ${
                  isDark
                    ? "bg-gradient-to-r from-red-400 to-red-600"
                    : "bg-gradient-to-r from-red-500 to-red-700"
                }`}
              >
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  TechCorp Inc.
                </h1>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Recruitment Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfileModal(true)}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div
          className={`mb-8 border-b ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex space-x-8 overflow-x-auto">
            {Object.entries(tabContent).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  console.log(key);
                  setActiveTab(key);
                }}
                className={`py-4 px-2 whitespace-nowrap font-medium text-sm transition-all duration-300 border-b-2 ${
                  activeTab === key
                    ? isDark
                      ? "border-purple-400 text-purple-400"
                      : "border-purple-600 text-purple-600"
                    : isDark
                    ? "border-transparent text-slate-400 hover:text-slate-300"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Company Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    onClick={() => {
                      stat.func();
                    }}
                    key={index}
                    className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isDark
                        ? "bg-slate-800/50 border border-slate-700/50"
                        : "bg-white/80 border border-white/50"
                    } backdrop-blur-lg shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className={`text-lg font-medium ${
                            isDark ? "text-slate-300" : "text-black"
                          }`}
                        >
                          {stat.title}
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Recommendations Tab */}
        {activeTab === "candidates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  AI-Recommended Candidates
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Smart matches based on resume-job analysis
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  <Filter
                    className={`w-4 h-4 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Filter
                  </span>
                </button>
              </div>
            </div>

            {aiRecommendedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white/80 border-white/50"
                } backdrop-blur-lg shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                        isDark
                          ? "bg-gradient-to-r from-purple-500 to-blue-500"
                          : "bg-gradient-to-r from-purple-600 to-blue-600"
                      }`}
                    >
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3
                          className={`text-xl font-semibold ${
                            isDark ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {candidate.name}
                        </h3>
                        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                          <Sparkles className="w-4 h-4 text-white" />
                          <span className="text-sm font-bold text-white">
                            {candidate.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mb-3 text-sm">
                        <span
                          className={`flex items-center ${
                            isDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {candidate.college}
                        </span>
                        <span
                          className={`flex items-center font-medium ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          {candidate.cgpa} CGPA
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDark
                                ? "bg-slate-700 text-slate-300"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                        isDark
                          ? "bg-blue-500 hover:bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-500"
                      }`}
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        Resume
                      </span>
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                        candidate.shortlisted
                          ? isDark
                            ? "bg-green-600"
                            : "bg-green-500"
                          : isDark
                          ? "bg-purple-500 hover:bg-purple-400"
                          : "bg-purple-600 hover:bg-purple-500"
                      }`}
                    >
                      <span className="text-sm font-medium text-white">
                        {candidate.shortlisted ? "Shortlisted ✓" : "Shortlist"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Posting Modal */}
      {showJobPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Create Job Posting
              </h3>
              <button
                onClick={() => setShowJobPostModal(false)}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <X
                  className={`w-5 h-5 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Development Engineer"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Job Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    CTC Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 12-18 LPA"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Number of Positions
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Required Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Node.js, Python (comma separated)"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Technologies/Tools
                </label>
                <input
                  type="text"
                  placeholder="e.g., AWS, Docker, Kubernetes"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 7.0"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Eligible Branches
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CSE, IT, ECE"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Drive Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "bg-purple-500 hover:bg-purple-400"
                      : "bg-purple-600 hover:bg-purple-500"
                  }`}
                >
                  <span className="font-medium text-white">Post Job</span>
                </button>
                <button
                  onClick={() => setShowJobPostModal(false)}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Company Profile
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <X
                  className={`w-5 h-5 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`w-24 h-24 rounded-xl flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-r from-purple-500 to-blue-600"
                      : "bg-gradient-to-r from-purple-600 to-blue-600"
                  }`}
                >
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <button
                  className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  }`}
                >
                  <Upload
                    className={`w-4 h-4 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Upload Logo
                  </span>
                </button>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  defaultValue="TechCorp Inc."
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Company Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description about your company..."
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Technology, Finance"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Company Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1000-5000 employees"
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                      isDark
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Website
                </label>
                <input
                  type="url"
                  placeholder="https://www.company.com"
                  className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
              <div className="pt-4 border-t border-slate-700">
                <h4
                  className={`font-semibold mb-4 ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  HR Contact Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      HR Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                        isDark
                          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                          : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="hr@company.com"
                        className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                          isDark
                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 1234567890"
                        className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                          isDark
                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-4">
                <button
                  className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 ${
                    isDark
                      ? "bg-purple-500 hover:bg-purple-400"
                      : "bg-purple-600 hover:bg-purple-500"
                  }`}
                >
                  <Save className="w-4 h-4 text-white" />
                  <span className="font-medium text-white">Save Changes</span>
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  <span className="font-medium">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
