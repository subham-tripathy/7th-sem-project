import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Zap,
  BookOpen,
  Calendar,
  Trophy,
  Target,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  User,
  Settings,
  LogOut,
  Plus,
  Filter,
  Download,
  Eye,
} from "lucide-react";

export default function StudentHomePage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const studentData = {
    name: "Alex Johnson",
    major: "Computer Science",
    year: "Senior",
    gpa: "3.8",
    profileCompletion: 85,
    skillsMatched: 12,
    applicationsSent: 8,
    interviewsScheduled: 3,
  };

  const recentActivities = [
    {
      type: "application",
      company: "TechCorp Inc.",
      status: "pending",
      time: "2 hours ago",
    },
    {
      type: "interview",
      company: "StartupXYZ",
      status: "scheduled",
      time: "1 day ago",
    },
    { type: "skill", skill: "React.js", level: "Advanced", time: "3 days ago" },
    {
      type: "course",
      course: "Data Structures",
      grade: "A-",
      time: "1 week ago",
    },
  ];

  const upcomingEvents = [
    { title: "Career Fair", date: "Oct 25", time: "10:00 AM", type: "event" },
    {
      title: "Technical Interview - Google",
      date: "Oct 28",
      time: "2:00 PM",
      type: "interview",
    },
    {
      title: "Algorithm Design Final",
      date: "Nov 2",
      time: "9:00 AM",
      type: "exam",
    },
    {
      title: "Networking Mixer",
      date: "Nov 5",
      time: "6:00 PM",
      type: "event",
    },
  ];

  const jobRecommendations = [
    {
      title: "Frontend Developer Intern",
      company: "Microsoft",
      location: "Seattle, WA",
      match: 95,
      type: "Internship",
    },
    {
      title: "Software Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      match: 88,
      type: "Full-time",
    },
    {
      title: "Data Analyst",
      company: "Amazon",
      location: "Austin, TX",
      match: 82,
      type: "Full-time",
    },
    {
      title: "Web Developer",
      company: "Shopify",
      location: "Remote",
      match: 79,
      type: "Contract",
    },
  ];

  const courses = [
    { name: "Advanced Algorithms", progress: 78, grade: "A-", credits: 3 },
    { name: "Database Systems", progress: 92, grade: "A", credits: 3 },
    { name: "Software Engineering", progress: 65, grade: "B+", credits: 4 },
    {
      name: "Machine Learning",
      progress: 45,
      grade: "In Progress",
      credits: 3,
    },
  ];

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? isDark
            ? "bg-blue-600 text-white"
            : "bg-blue-600 text-white"
          : isDark
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div
      className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold mt-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-[90vh] transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div
              className={`p-6 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Welcome back, {studentData.name}! 👋
                  </h1>
                  <p
                    className={`mt-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your profile is {studentData.profileCompletion}% complete.
                    <button className="text-blue-500 hover:text-blue-600 ml-1">
                      Complete your profile
                    </button>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`flex gap-2 items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Apply to Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                My Courses
              </h1>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {course.name}
                    </h3>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        course.grade === "A"
                          ? "bg-green-100 text-green-800"
                          : course.grade === "A-"
                          ? "bg-green-100 text-green-800"
                          : course.grade === "B+"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.grade}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Progress
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <div
                      className={`w-full bg-gray-200 rounded-full h-2 ${
                        isDark ? "bg-gray-700" : ""
                      }`}
                    >
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {course.credits} Credits
                    </span>
                    <button
                      className={`text-sm ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      } hover:underline`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "opportunities" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Career Opportunities
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  className={`p-2 rounded-lg border ${
                    isDark
                      ? "border-gray-600 hover:bg-gray-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Resume
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {jobRecommendations
                .concat(jobRecommendations)
                .map((job, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      isDark
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {job.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              isDark
                                ? "bg-blue-900 text-blue-300"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {job.type}
                          </span>
                        </div>
                        <p
                          className={`text-lg font-medium mb-2 ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {job.company}
                        </p>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin
                              className={`w-4 h-4 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {job.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock
                              className={`w-4 h-4 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Posted 2 days ago
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {job.match}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className={`p-2 rounded-lg border transition-colors duration-200 ${
                            isDark
                              ? "border-gray-600 hover:bg-gray-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Eye
                            className={`w-5 h-5 ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          />
                        </button>
                        <button
                          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            isDark
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-8">
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Academic Calendar
            </h1>
            <div
              className={`p-8 rounded-xl border text-center ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <Calendar
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Calendar View Coming Soon
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Interactive calendar with all your events, deadlines, and
                appointments will be available here.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
