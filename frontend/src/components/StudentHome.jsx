import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Briefcase,
  User,
  FileText,
  TrendingUp,
  BookOpen,
  Mic,
  MessageSquare,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Target,
  Award,
  Brain,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  Star,
  Filter,
  PhoneCall,
  CpuIcon,
} from "lucide-react";
import { backendURL } from "./functions";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a student
  if (!user || user.role !== "student") {
    navigate("/");
  }

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [authToken] = useState(localStorage.getItem("placementHubUser"));

  // State for various data
  const [eligibleJobs, setEligibleJobs] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState({});
  const [skillGaps, setSkillGaps] = useState([]);
  const [mockInterviewActive, setMockInterviewActive] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchProfile();
    fetchEligibleJobs();
    fetchAIRecommendations();
    fetchApplications();
    fetchSkillGaps();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${backendURL}/api/students/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchEligibleJobs = async () => {
    // Mock data for eligible jobs
    setEligibleJobs([
      {
        id: 1,
        company: "TCS",
        role: "Software Developer",
        package: "4.5 LPA",
        deadline: "2024-02-15",
        minCGPA: 6.5,
        branches: ["CSE", "ECE"],
        status: "Open",
      },
      {
        id: 2,
        company: "Infosys",
        role: "System Engineer",
        package: "3.8 LPA",
        deadline: "2024-02-20",
        minCGPA: 6.0,
        branches: ["CSE", "ECE", "MECH"],
        status: "Open",
      },
      {
        id: 3,
        company: "Wipro",
        role: "Project Engineer",
        package: "3.5 LPA",
        deadline: "2024-02-25",
        minCGPA: 6.0,
        branches: ["All"],
        status: "Open",
      },
    ]);
  };

  const fetchAIRecommendations = async () => {
    // Mock AI recommendations with match percentage
    setAiRecommendations([
      {
        id: 1,
        company: "Google",
        role: "Software Engineer",
        matchPercentage: 92,
        package: "12 LPA",
        skills: ["Python", "DSA", "System Design"],
        reason: "Strong match with your Python skills and project experience",
      },
      {
        id: 2,
        company: "Microsoft",
        role: "SDE-1",
        matchPercentage: 88,
        package: "10 LPA",
        skills: ["C++", "Cloud", "ML"],
        reason: "Good fit based on your academic performance and interests",
      },
      {
        id: 3,
        company: "Amazon",
        role: "SDE Intern",
        matchPercentage: 85,
        package: "8 LPA",
        skills: ["Java", "AWS", "Problem Solving"],
        reason: "Matches your problem-solving skills and Java knowledge",
      },
    ]);
  };

  const fetchApplications = async () => {
    // Mock application data
    setApplications([
      {
        id: 1,
        company: "TCS",
        role: "Software Developer",
        appliedDate: "2024-01-15",
        status: "Shortlisted",
        nextRound: "Technical Interview - Feb 20",
      },
      {
        id: 2,
        company: "Infosys",
        role: "System Engineer",
        appliedDate: "2024-01-10",
        status: "Applied",
        nextRound: "Awaiting Response",
      },
      {
        id: 3,
        company: "Cognizant",
        role: "Programmer Analyst",
        appliedDate: "2024-01-05",
        status: "Selected",
        nextRound: "Offer Letter Sent",
      },
    ]);
  };

  const fetchSkillGaps = async () => {
    // Mock skill gap analysis
    setSkillGaps([
      {
        skill: "Data Structures",
        currentLevel: 70,
        requiredLevel: 90,
        importance: "High",
        resources: ["LeetCode", "GeeksforGeeks"],
      },
      {
        skill: "System Design",
        currentLevel: 40,
        requiredLevel: 80,
        importance: "Medium",
        resources: ["System Design Primer", "Coursera"],
      },
      {
        skill: "Cloud Computing",
        currentLevel: 30,
        requiredLevel: 70,
        importance: "Medium",
        resources: ["AWS Free Tier", "Google Cloud Skills"],
      },
    ]);
  };

  // Dashboard Statistics
  const stats = {
    eligibleJobs: eligibleJobs.length,
    applications: applications.length,
    shortlisted: applications.filter(a => a.status === "Shortlisted").length,
    avgMatchScore: Math.round(
      aiRecommendations.reduce((acc, curr) => acc + curr.matchPercentage, 0) /
      aiRecommendations.length || 0
    ),
  };

  // Chart Data
  const applicationStatusData = [
    { name: "Applied", value: 5, color: "#3B82F6" },
    { name: "Shortlisted", value: 3, color: "#10B981" },
    { name: "Selected", value: 1, color: "#F59E0B" },
    { name: "Rejected", value: 1, color: "#EF4444" },
  ];

  const skillRadarData = [
    { skill: "DSA", A: 85, fullMark: 100 },
    { skill: "Web Dev", A: 75, fullMark: 100 },
    { skill: "Database", A: 70, fullMark: 100 },
    { skill: "Cloud", A: 40, fullMark: 100 },
    { skill: "ML/AI", A: 60, fullMark: 100 },
    { skill: "Soft Skills", A: 80, fullMark: 100 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setModalType("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendURL}/api/students/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Profile updated successfully");
        setProfile(formData);
        closeModal();
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleJobApplication = async (jobId) => {
    try {
      const response = await fetch(`${backendURL}/api/drives/${jobId}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Applied successfully!");
        fetchApplications();
      }
    } catch (error) {
      toast.error("Error applying to job");
    }
  };

  const startMockInterview = (job) => {
    setSelectedJob(job);
    setMockInterviewActive(true);
    setInterviewFeedback(null);
  };

  const endMockInterview = () => {
    setMockInterviewActive(false);
    // Generate mock feedback
    setInterviewFeedback({
      score: 78,
      strengths: ["Good communication", "Technical knowledge"],
      improvements: ["Work on system design", "Practice behavioral questions"],
      missingKeywords: ["Scalability", "Microservices", "Agile"],
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Eligible Jobs</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.eligibleJobs}
              </p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Applications</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.applications}
              </p>
            </div>
            <FileText className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Shortlisted</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {stats.shortlisted}
              </p>
            </div>
            <Award className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">🤖 AI Job Recommendations</h3>
          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <div className="space-y-3">
          {aiRecommendations.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{job.company}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {job.matchPercentage}% Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{job.role} • {job.package}</p>
                  <p className="text-xs text-gray-500 mt-2">{job.reason}</p>
                  <div className="flex gap-2 mt-2">
                    {job.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleJobApplication(job.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Skill Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Your Skills"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderJobOpportunities = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Opportunities</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {eligibleJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{job.company}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{job.role}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>💰 {job.package}</span>
                  <span>📅 Deadline: {job.deadline}</span>
                  <span>📊 Min CGPA: {job.minCGPA}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {job.branches.map((branch) => (
                    <span
                      key={branch}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleJobApplication(job.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={() => startMockInterview(job)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Mock Interview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button
          onClick={() => openModal("editProfile", profile)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{profile.name || "John Doe"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.email || "john@example.com"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{profile.phone || "+91 9876543210"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="font-medium">{profile.studentId || "2020CSE001"}</p>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Academic Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-medium">{profile.branch || "Computer Science"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CGPA</p>
              <p className="font-medium">{profile.cgpa || "8.5"}/10</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Batch</p>
              <p className="font-medium">{profile.batch || "2020-2024"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Resume</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium">Resume_JohnDoe_2024.pdf</p>
              <p className="text-sm text-gray-600">Last updated: Jan 15, 2024</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2">
              <Eye className="w-4 h-4" /> View
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload New
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMockInterview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Mock Interview</h2>
      </div>

      {!mockInterviewActive && !interviewFeedback && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Practice Makes Perfect</h3>
          <p className="text-gray-600 mb-6">
            Select a job opportunity to start a mock interview tailored to that role
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <CpuIcon className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-semibold">Tech Interview</h4>
              <p className="text-sm text-gray-600">Practice with voice responses</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-semibold">HR Interview</h4>
              <p className="text-sm text-gray-600">Type your responses</p>
            </div>
          </div>
        </div>
      )}

      {mockInterviewActive && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Interview in Progress</h3>
            <button
              onClick={endMockInterview}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Interview
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">Question 1:</p>
              <p className="mt-2">Tell me about yourself and your experience with web development.</p>
            </div>
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="4"
              placeholder="Type your answer here..."
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Next Question
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {interviewFeedback && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Interview Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{interviewFeedback.score}%</p>
              <p className="text-sm text-gray-600 mt-1">Overall Score</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-xl font-bold text-green-600">Good</p>
              <p className="text-sm text-gray-600 mt-1">Performance</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-xl font-bold text-orange-600">3/5</p>
              <p className="text-sm text-gray-600 mt-1">Stars</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">✅ Strengths</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {interviewFeedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📈 Areas for Improvement</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {interviewFeedback.improvements.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔑 Missing Keywords</h4>
              <div className="flex gap-2 flex-wrap">
                {interviewFeedback.missingKeywords.map((keyword) => (
                  <span key={keyword} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setInterviewFeedback(null)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Another Interview
          </button>
        </div>
      )}
    </div>
  );

  const renderSkillGap = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh Analysis
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Skill Assessment</h3>
        <div className="space-y-4">
          {skillGaps.map((skill) => (
            <div key={skill.skill} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{skill.skill}</h4>
                  <p className="text-sm text-gray-600">
                    Importance:
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${skill.importance === "High"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {skill.importance}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Gap</p>
                  <p className="text-xl font-bold text-orange-600">
                    {skill.requiredLevel - skill.currentLevel}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Level</span>
                    <span>{skill.currentLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Required Level</span>
                    <span>{skill.requiredLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${skill.requiredLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-sm font-medium mb-2">Recommended Resources:</p>
                <div className="flex gap-2 flex-wrap">
                  {skill.resources.map((resource) => (
                    <a
                      key={resource}
                      href="#"
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
                    >
                      {resource} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recommended Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Data Structures & Algorithms</h4>
                <p className="text-sm text-gray-600 mt-1">Master DSA concepts for technical interviews</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">4.8</span>
                  <span className="text-sm text-gray-500">• 12 weeks</span>
                </div>
                <button className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">System Design Fundamentals</h4>
                <p className="text-sm text-gray-600 mt-1">Learn to design scalable systems</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">4.6</span>
                  <span className="text-sm text-gray-500">• 8 weeks</span>
                </div>
                <button className="mt-3 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationStatus = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Status</h2>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Applications</option>
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{app.company}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${app.status === "Selected"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Shortlisted"
                        ? "bg-blue-100 text-blue-800"
                        : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{app.role}</p>
                <p className="text-sm text-gray-500 mt-2">Applied on: {app.appliedDate}</p>

                {app.nextRound && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Next Step: {app.nextRound}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${["Shortlisted", "Selected"].includes(app.status)
                        ? "bg-green-500"
                        : app.status === "Applied"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`} />
                    <span className="text-sm">Applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${["Shortlisted", "Selected"].includes(app.status)
                        ? "bg-green-500"
                        : "bg-gray-300"
                      }`} />
                    <span className="text-sm">Shortlisted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${app.status === "Selected"
                        ? "bg-green-500"
                        : "bg-gray-300"
                      }`} />
                    <span className="text-sm">Selected</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  View Details
                </button>
                {app.status === "Selected" && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Accept Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">
            {modalType === "editProfile" ? "Edit Profile" : "Modal"}
          </h3>

          {modalType === "editProfile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="LinkedIn Profile"
                value={formData.linkedin || ""}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="GitHub Profile"
                value={formData.github || ""}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="About Me"
                value={formData.about || ""}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />

              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {profile.name || "Student"}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{profile.name || "John Doe"}</p>
                <p className="text-xs text-gray-600">{profile.email || "student@college.edu"}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {(profile.name || "S")[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "jobs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Job Opportunities
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("mockInterview")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "mockInterview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Mock Interview
            </button>
            <button
              onClick={() => setActiveTab("skillGap")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "skillGap"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Skill Gap
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === "applications"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Applications
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "jobs" && renderJobOpportunities()}
        {activeTab === "profile" && renderProfile()}
        {activeTab === "mockInterview" && renderMockInterview()}
        {activeTab === "skillGap" && renderSkillGap()}
        {activeTab === "applications" && renderApplicationStatus()}
      </main>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default StudentHome;