import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Briefcase,
  Brain,
  Target,
  FileText,
  Star,
  AlertCircle,
  Check,
  X,
  Search,
  Filter,
} from "lucide-react";
import { backendURL } from "./functions";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const companyHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user == null || user.role != "company") {
    navigate("/");
  }

  const modal = {
    addCompany: "Add New Company",
    editCompany: "Edit Company",
    addStudent: "Add New Student",
    editStudent: "Edit Student",
    addDrive: "Create New Drive",
    addJob: "Add New Job Role",
    editJob: "Edit Job Role",
    viewCandidates: "AI Recommended Candidates",
    submitResults: "Submit Selection Results",
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({});
  const [authToken, setAuthToken] = useState(localStorage.getItem("placementHubUser"));
  const [selectedJob, setSelectedJob] = useState(null);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch drives
  useEffect(() => {
    fetchDrives();
  }, [showModal]);

  const fetchDrives = () => {
    const user = jwtDecode(localStorage.getItem("placementHubUser"))
    fetch(`${backendURL}/api/companydrives`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setDrives(data);
      })
      .catch((e) => {
        console.log("Error fetching drives:", e);
      });
  };

  const fetchAIRecommendations = (jobId) => {
    setLoadingRecommendations(true);
    // Mock AI recommendations - replace with actual Flask API call
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          matchPercentage: 92,
          keySkills: ["React", "Node.js"],
          missingSkills: ["MongoDB"],
          cgpa: 8.5,
          branch: "CSE",
          resumeLink: "/resume/john.pdf",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          matchPercentage: 85,
          keySkills: ["React", "MongoDB"],
          missingSkills: ["Node.js"],
          cgpa: 8.2,
          branch: "CSE",
          resumeLink: "/resume/jane.pdf",
        },
        {
          id: 3,
          name: "Bob Wilson",
          email: "bob@example.com",
          matchPercentage: 78,
          keySkills: ["Node.js"],
          missingSkills: ["React", "MongoDB"],
          cgpa: 7.8,
          branch: "IT",
          resumeLink: "/resume/bob.pdf",
        },
      ];
      setRecommendations(mockRecommendations);
      setLoadingRecommendations(false);
    }, 1500);
  };

  // Enhanced Dashboard stats
  const stats = {
    activeDrives: drives.filter((d) => d.status === "Scheduled").length,
    totalPlaced: students.filter((s) => s.isPlaced).length,
    activeJobs: jobs.filter((j) => j.status === "Active").length,
    totalCompanies: companies.length,
    pendingResults: 5, // Mock value
    totalApplications: jobs.reduce((acc, job) => acc + (job.applicants || 0), 0),
  };

  // Chart data
  const placementByDept = [
    { name: "CSE", placements: 65 },
    { name: "ECE", placements: 42 },
    { name: "MECH", placements: 28 },
    { name: "CIVIL", placements: 21 },
  ];

  const jobApplicationStats = [
    { name: "Applied", value: 320 },
    { name: "Shortlisted", value: 180 },
    { name: "Selected", value: 85 },
    { name: "Rejected", value: 55 },
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
    setRecommendations([]);
    setSelectedJob(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === "addJob" || modalType === "editJob") {
      const jobData = {
        title: formData.title,
        description: formData.description,
        eligibility: formData.eligibility,
        skills: formData.skills.split(",").map((s) => s.trim()),
        ctc: formData.ctc,
        company: formData.company,
        status: formData.status || "Active",
      };

      if (modalType === "addJob") {
        // Add job API call
        toast.success("Job Role Created Successfully");
      } else {
        // Update job API call
        toast.success("Job Role Updated Successfully");
      }
      closeModal();
    } else if (modalType === "submitResults") {
      // Submit results API call
      const resultsData = {
        jobId: formData.jobId,
        selectedCandidates: formData.selectedCandidates,
        feedback: {
          communication: formData.communicationFeedback,
          technical: formData.technicalFeedback,
          overall: formData.overallFeedback,
        },
      };
      toast.success("Selection Results Submitted Successfully");
      closeModal();
    } else if (modalType === "addCompany") {
      fetch(`${backendURL}/api/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          hrName: formData.hrName,
          hrEmail: formData.hrEmail,
          roles: formData.roles.split(",").map((r) => r.trim()),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success("Company Created Successfully");
          closeModal();
        });
    } else if (modalType === "editCompany") {
      fetch(`${backendURL}/api/companies/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          hrName: formData.hrName,
          hrEmail: formData.hrEmail,
          roles: formData.roles.split(",").map((r) => r.trim()),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          closeModal();
        });
    } else if (modalType === "addStudent") {
      fetch(`${backendURL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          branch: formData.branch,
          cgpa: parseFloat(formData.cgpa),
          email: formData.email,
          resumeLink: formData.resume,
          password: Math.random().toString(36).slice(-8),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status == "error") {
            toast.error(data.message);
          }
          toast.success("Student Created Successfully");
          closeModal();
        })
        .catch((e) => console.log("Error adding student:", e));
    } else if (modalType === "editStudent") {
      fetch(`${backendURL}/api/students/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          branch: formData.branch,
          cgpa: parseFloat(formData.cgpa),
          email: formData.email,
          resumeLink: formData.resume,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          closeModal();
        })
        .catch((e) => console.log("Error updating student:", e));
    } else if (modalType === "addDrive") {
      const company = companies.find((c) => c.name === formData.company);
      if (!company) {
        alert("Please select a valid company");
        return;
      }

      fetch(`${backendURL}/api/drives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          company: company.id,
          title: `${formData.company} Recruitment Drive`,
          description: `Placement drive for ${formData.roles}`,
          roles: formData.roles.split(",").map((r) => r.trim()),
          driveDate: new Date(formData.date).toISOString(),
          eligibilityCriteria: {
            minCGPA: 6.0,
            branches: ["CSE", "ECE", "MECH", "CIVIL", "EEE"],
            maxBacklogs: 0,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          closeModal();
        })
        .catch((e) => console.log("Error creating drive:", e));
    }
  };

  const deleteItem = (type, id) => {
    if (type === "job") {
      // Delete job API call
      setJobs(jobs.filter((j) => j.id !== id));
      toast.success("Job Role Deleted Successfully");
    } else if (type === "company") {
      fetch(`${backendURL}/api/companies/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setCompanies(companies.filter((c) => c.id !== id));
        })
        .catch((e) => console.log("Error deleting company:", e));
    } else if (type === "student") {
      fetch(`${backendURL}/api/students/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStudents(students.filter((s) => s._id !== id));
        })
        .catch((e) => console.log("Error deleting student:", e));
    } else if (type === "drive") {
      fetch(`${backendURL}/api/drives/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setDrives(drives.filter((d) => d._id !== id));
        })
        .catch((e) => console.log("Error deleting drive:", e));
    }
  };

  const toggleJobStatus = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const updatedStatus = job.status === "Active" ? "Inactive" : "Active";
      // Update job status API call
      setJobs(
        jobs.map((j) =>
          j.id === jobId ? { ...j, status: updatedStatus } : j
        )
      );
      toast.success(`Job status updated to ${updatedStatus}`);
    }
  };

  const shortlistCandidate = (candidate) => {
    if (!shortlistedCandidates.find((c) => c.id === candidate.id)) {
      setShortlistedCandidates([...shortlistedCandidates, candidate]);
      toast.success(`${candidate.name} added to shortlist`);
    } else {
      setShortlistedCandidates(
        shortlistedCandidates.filter((c) => c.id !== candidate.id)
      );
      toast.info(`${candidate.name} removed from shortlist`);
    }
  };

  const approveStudent = (id) => {
    fetch(`${backendURL}/api/students/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents(
          students.map((s) => (s._id === id ? { ...s, status: "Approved" } : s))
        );
      })
      .catch((e) => console.log("Error approving student:", e));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.activeJobs}
              </p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Students Placed
              </p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.totalPlaced}
              </p>
            </div>
            <Users className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {stats.totalApplications}
              </p>
            </div>
            <FileText className="w-12 h-12 text-orange-400" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Companies</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.totalCompanies}
              </p>
            </div>
            <Building2 className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Pending Results</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                {stats.pendingResults}
              </p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Active Drives</p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">
                {stats.activeDrives}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-indigo-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Placements by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placementByDept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="placements" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobApplicationStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobApplicationStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">New job posting: Software Developer at TechCorp</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">AI recommendations generated for Data Analyst role</span>
            </div>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Selection results submitted for Marketing role</span>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Management</h2>
        <button
          onClick={() => openModal("addCompany")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                HR Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{company.id}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {company.name}
                </td>
                <td className="px-6 py-4 text-sm">{company.hrName}</td>
                <td className="px-6 py-4 text-sm">{company.hrEmail}</td>
                <td className="px-6 py-4 text-sm">
                  {Array.isArray(company.roles)
                    ? company.roles.join(", ")
                    : company.roles}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal("editCompany", company)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem("company", company.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button
            onClick={() => openModal("addStudent")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                CGPA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{student.studentId}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm">{student.branch}</td>
                <td className="px-6 py-4 text-sm">{student.cgpa}</td>
                <td className="px-6 py-4 text-sm">{student.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${student.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {student.status === "Pending" && (
                      <button
                        onClick={() => approveStudent(student._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openModal("editStudent", student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem("student", student._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrives = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Drive Management</h2>
        <button
          onClick={() => openModal("addDrive")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Create Drive
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {drives.map((drive) => (
              <tr key={drive._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{drive.driveId}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {drive.companyName}
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(drive.driveDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  {Array.isArray(drive.roles)
                    ? drive.roles.join(", ")
                    : drive.roles}
                </td>
                <td className="px-6 py-4 text-sm">
                  {drive.registeredStudents?.length || 0}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${drive.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {drive.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    {drive.status === "Scheduled" && (
                      <button
                        onClick={() => openModal("submitResults", { driveId: drive._id })}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteItem("drive", drive._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Placements</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalPlaced}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Highest Package</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹18 LPA</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Average Package</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹6.2 LPA</p>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">{modal[modalType]}</h3>

          {modalType === "viewCandidates" ? (
            <div className="space-y-4">
              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">
                      AI Recommended Candidates for {selectedJob?.title}
                    </h4>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                      </button>
                      <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {recommendations.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-semibold text-lg">
                                {candidate.name}
                              </h5>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                {candidate.matchPercentage}% Match
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  Email: {candidate.email}
                                </p>
                                <p className="text-gray-600">
                                  Branch: {candidate.branch} | CGPA:{" "}
                                  {candidate.cgpa}
                                </p>
                              </div>
                              <div>
                                <p className="text-green-600">
                                  <strong>Key Skills:</strong>{" "}
                                  {candidate.keySkills.join(", ")}
                                </p>
                                <p className="text-orange-600">
                                  <strong>Missing Skills:</strong>{" "}
                                  {candidate.missingSkills.join(", ")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700">
                              <Download className="w-4 h-4" /> Resume
                            </button>
                            <button
                              onClick={() => shortlistCandidate(candidate)}
                              className={`px-3 py-1 rounded-lg text-sm flex items-center gap-2 ${shortlistedCandidates.find(
                                (c) => c.id === candidate.id
                              )
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              <Star className="w-4 h-4" />
                              {shortlistedCandidates.find(
                                (c) => c.id === candidate.id
                              )
                                ? "Shortlisted"
                                : "Shortlist"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {shortlistedCandidates.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold mb-2">
                        Shortlisted Candidates ({shortlistedCandidates.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {shortlistedCandidates.map((c) => (
                          <span
                            key={c.id}
                            className="px-3 py-1 bg-white rounded-full text-sm"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : modalType === "submitResults" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Candidates (CSV or paste names)
                </label>
                <textarea
                  value={formData.selectedCandidates || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectedCandidates: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg h-24"
                  placeholder="John Doe, Jane Smith, ..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Result File
                </label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-lg"
                  accept=".csv,.xlsx,.pdf"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication Skills Feedback
                  </label>
                  <select
                    value={formData.communicationFeedback || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationFeedback: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Skills Feedback
                  </label>
                  <select
                    value={formData.technicalFeedback || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalFeedback: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Assessment
                  </label>
                  <select
                    value={formData.overallFeedback || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overallFeedback: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={formData.comments || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg h-24"
                  placeholder="Any additional feedback or suggestions..."
                />
              </div>

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
                  Submit Results
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(modalType === "addJob" || modalType === "editJob") && (
                <>
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Job Description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg h-24"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Eligibility Criteria"
                    value={formData.eligibility || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, eligibility: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Required Skills (comma separated)"
                    value={
                      Array.isArray(formData.skills)
                        ? formData.skills.join(", ")
                        : formData.skills || ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CTC Range"
                    value={formData.ctc || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ctc: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <select
                    value={formData.company || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {(modalType === "addCompany" || modalType === "editCompany") && (
                <>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="HR Name"
                    value={formData.hrName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hrName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="HR Email"
                    value={formData.hrEmail || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hrEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role Titles (comma separated)"
                    value={
                      Array.isArray(formData.roles)
                        ? formData.roles.join(", ")
                        : formData.roles || ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, roles: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </>
              )}

              {(modalType === "addStudent" || modalType === "editStudent") && (
                <>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <select
                    value={formData.branch || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, branch: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EEE">EEE</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="CGPA"
                    value={formData.cgpa || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cgpa: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Resume Link"
                    value={formData.resumeLink || formData.resume || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, resume: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </>
              )}

              {modalType === "addDrive" && (
                <>
                  <select
                    value={formData.company || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role Titles (comma separated)"
                    value={formData.roles || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, roles: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </>
              )}

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
                  {modalType.includes("edit") ? "Update" : "Create"}
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
                Company Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-600">{user.id}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("drives")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "drives"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Drives
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "reports"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Reports
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "companies" && renderCompanies()}
        {activeTab === "students" && renderStudents()}
        {activeTab === "drives" && renderDrives()}
        {activeTab === "reports" && renderReports()}
      </main>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default companyHomePage;