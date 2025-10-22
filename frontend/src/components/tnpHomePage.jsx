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
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
} from "lucide-react";
import { backendURL } from "./functions";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TnPHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate()
  if (user == null || user.role != "admin") {
    navigate("/")
  }

  const modal = {
    addCompany: "Add New Company",
    editCompany: "Edit Company",
    addStudent: "Add New Student",
    editStudent: "Edit Student",
    addDrive: "Create New Drive",
  };
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [formData, setFormData] = useState({});
  const [authToken, setAuthToken] = useState(localStorage.getItem("placementHubUser"));
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    designation: "",
    employeeId: user?.id || "",
    address: "",
    bio: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, [showModal]);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [showModal]);

  // Fetch drives
  useEffect(() => {
    fetchDrives();
  }, [showModal]);

  // Fetch profile data
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    // Fetch user profile data
    fetch(`${backendURL}/api/admin/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfileData({
            name: data.name || user?.name || "",
            email: data.email || user?.email || "",
            phone: data.phone || "",
            department: data.department || "",
            designation: data.designation || "",
            employeeId: data.employeeId || user?.id || "",
            address: data.address || "",
            bio: data.bio || "",
          });
          setProfileImage(data.profileImage || null);
        }
      })
      .catch((e) => {
        console.log("Error fetching profile:", e);
      });
  };

  const fetchCompanies = () => {
    fetch(`${backendURL}/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
      })
      .catch((e) => {
        console.log("Error fetching companies:", e);
      });
  };

  const fetchStudents = () => {
    fetch(`${backendURL}/api/students`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((e) => {
        console.log("Error fetching students:", e);
      });
  };

  const fetchDrives = () => {
    fetch(`${backendURL}/api/drives`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDrives(data);
      })
      .catch((e) => {
        console.log("Error fetching drives:", e);
      });
  };

  // Dashboard stats
  const stats = {
    activeDrives: drives.filter((d) => d.status === "Scheduled").length,
    totalPlaced: students.filter((s) => s.isPlaced).length,
    upcomingDrives: drives.filter((d) => d.status === "Scheduled").length,
    totalCompanies: companies.length,
  };

  // Chart data
  const placementByDept = [
    { name: "CSE", placements: 65 },
    { name: "ECE", placements: 42 },
    { name: "MECH", placements: 28 },
    { name: "CIVIL", placements: 21 },
  ];

  const companyParticipation = [
    { name: "TCS", students: 45 },
    { name: "Infosys", students: 38 },
    { name: "Wipro", students: 42 },
    { name: "Accenture", students: 31 },
  ];

  const salaryDistribution = [
    { range: "3-5 LPA", count: 65 },
    { range: "5-7 LPA", count: 48 },
    { range: "7-10 LPA", count: 32 },
    { range: "10+ LPA", count: 11 },
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalType === "addCompany") {
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
          toast.success("Company Created Successfully")
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
            toast.error(data.message)
          }
          console.log(data);
          toast.success("Student Created Successfully")
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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    fetch(`${backendURL}/api/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
      })
      .catch((e) => {
        console.log("Error updating profile:", e);
        toast.error("Failed to update profile");
      });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    fetch(`${backendURL}/api/admin/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Password changed successfully");
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setChangePassword(false);
        } else {
          toast.error(data.message || "Failed to change password");
        }
      })
      .catch((e) => {
        console.log("Error changing password:", e);
        toast.error("Failed to change password");
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteItem = (type, id) => {
    if (type === "company") {
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

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditingProfile && (
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{profileData.name}</h3>
            <p className="text-gray-600">{profileData.designation || "TNP Admin"}</p>
            <p className="text-sm text-gray-500">{profileData.employeeId}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={profileData.designation}
                onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                value={profileData.employeeId}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              disabled={!isEditingProfile}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!isEditingProfile}
              rows="4"
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
            />
          </div>

          {isEditingProfile && (
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  fetchProfileData();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Security Settings</h3>
          {!changePassword && (
            <button
              onClick={() => setChangePassword(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Change Password
            </button>
          )}
        </div>

        {changePassword && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setChangePassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity Log Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">Profile Updated</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">New Drive Created</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">Student Approved</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Drives</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.activeDrives}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-blue-400" />
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
                Upcoming Drives
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {stats.upcomingDrives}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-400" />
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
          <h3 className="text-lg font-semibold mb-4">Company Participation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companyParticipation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="students"
              >
                {companyParticipation.map((entry, index) => (
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
                    {drive.status === "Completed" && (
                      <button className="text-green-600 hover:text-green-800">
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
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPlaced}</p>
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

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Salary Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salaryDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Job Category Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">42%</p>
            <p className="text-sm text-gray-600 mt-1">IT/Software</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">28%</p>
            <p className="text-sm text-gray-600 mt-1">Core Engineering</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">18%</p>
            <p className="text-sm text-gray-600 mt-1">Consulting</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">12%</p>
            <p className="text-sm text-gray-600 mt-1">Others</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">{modal[modalType]}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                TNP Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Training & Placement Management System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-600">{user.id}</p>
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-700 cursor-pointer"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "A"}
              </button>
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
              onClick={() => setActiveTab("companies")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "companies"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Companies
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "students"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Students
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
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
                }`}
            >
              Profile
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
        {activeTab === "profile" && renderProfile()}
      </main>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default TnPHomePage;