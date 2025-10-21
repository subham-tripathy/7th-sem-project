import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  Star,
  Save,
  Upload,
  Users,
  Briefcase,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { backendURL } from './functions';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function CompanyHomePage() {
  const { user } = useAuth
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    selected: 0
  });

  // Form States
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    eligibility: '',
    skills: '',
    ctc: '',
    location: '',
    deadline: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);
  
  const fetchJobs = async () => {
    try {
      const user = jwtDecode(localStorage.getItem('placementHubUser'))
      // fetching all jobs listing of the current logged in company
      const response = await fetch(`${backendURL}/api/getJobListings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id
        })
      });
      
      const data = await response.json();
      console.log("all jobs listing");
      console.log(data);
      
      if (data.status === "success" && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchStats = async () => {
    // Replace with actual API call
    setStats({
      totalJobs: 5,
      totalApplications: 156,
      shortlisted: 48,
      selected: 12
    });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = jwtDecode(localStorage.getItem('placementHubUser'));
      
      // Add company ID to the form data
      const jobData = {
        ...jobForm,
        companyId: user.id
      };
      
      // Use the correct API endpoint
      const response = await fetch(`${backendURL}/api/jobs`, {
        method: isEditingJob ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        // Refresh jobs list
        await fetchJobs();

        // Reset form and states
        setJobForm({
          title: '',
          description: '',
          eligibility: '',
          skills: '',
          ctc: '',
          location: '',
          deadline: ''
        });
        setIsAddingJob(false);
        setIsEditingJob(false);
      } else {
        alert("Error: " + (data.message || "Failed to save job"));
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert("Error saving job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const findBestCandidates = async (jobId) => {
    setLoading(true);
    setSelectedJob(jobId);

    try {
      // Replace with actual API call to Flask
      const mockRecommendations = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          matchPercentage: 92,
          keySkills: ['React', 'Node.js', 'MongoDB'],
          missingSkills: ['Docker'],
          cgpa: 8.5,
          resumeUrl: '/resumes/john-doe.pdf'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          matchPercentage: 88,
          keySkills: ['React', 'JavaScript'],
          missingSkills: ['Node.js', 'MongoDB'],
          cgpa: 9.1,
          resumeUrl: '/resumes/jane-smith.pdf'
        },
        {
          id: 3,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          matchPercentage: 85,
          keySkills: ['Node.js', 'MongoDB'],
          missingSkills: ['React'],
          cgpa: 7.8,
          resumeUrl: '/resumes/alice-johnson.pdf'
        }
      ];

      setRecommendations(mockRecommendations);
      setActiveTab('recommendations');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (candidateId) => {
    try {
      // API call to shortlist candidate
      console.log('Shortlisting candidate:', candidateId);
    } catch (error) {
      console.error('Error shortlisting candidate:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', file);

        // Replace with actual API call
        console.log('Uploading selected students list...');
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
            <Briefcase className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <Users className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
            </div>
            <Star className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.selected}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {jobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.location} • {job.ctc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{job.applications} applications</span>
                  <button
                    onClick={() => findBestCandidates(job.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Find Candidates
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Job Management Component
  const JobManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
        <button
          onClick={() => setIsAddingJob(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Job
        </button>
      </div>

      {/* Job Form Modal */}
      {(isAddingJob || isEditingJob) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {isEditingJob ? 'Edit Job' : 'Add New Job'}
            </h3>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={jobForm.eligibility}
                  onChange={(e) => setJobForm({ ...jobForm, eligibility: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="Comma separated skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CTC Range
                  </label>
                  <input
                    type="text"
                    value={jobForm.ctc}
                    onChange={(e) => setJobForm({ ...jobForm, ctc: e.target.value })}
                    placeholder="e.g., 8-12 LPA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingJob(false);
                    setIsEditingJob(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.ctc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.applications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => findBestCandidates(job.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Find Candidates"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setJobForm(job);
                          setIsEditingJob(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => console.log('Delete job:', job.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // AI Recommendations Component
  const AIRecommendations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Recommended Candidates</h2>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Save className="h-5 w-5 mr-2" />
            Save Selected
          </button>
        </div>
      </div>

      {selectedJob && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Showing recommendations for: <strong>{jobs.find(j => j.id === selectedJob)?.title}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(candidate => (
          <div key={candidate.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                <p className="text-sm text-gray-600">{candidate.email}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{candidate.matchPercentage}%</div>
                <p className="text-xs text-gray-600">Match Score</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.keySkills.map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Missing Skills</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.missingSkills.map(skill => (
                    <span key={skill} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>CGPA: {candidate.cgpa}</span>
                <a
                  href={candidate.resumeUrl}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Resume
                </a>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleShortlist(candidate.id)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Shortlist
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recommendations available</p>
          <p className="text-sm text-gray-500 mt-2">Select a job posting and click "Find Best Candidates" to get AI recommendations</p>
        </div>
      )}
    </div>
  );

  // Result Submission Component
  const ResultSubmission = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Result Submission</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Selected Students List</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Upload CSV or Excel file with selected students</p>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Choose File
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Provide Feedback</h3>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Skills
            </label>
            <select
              value={feedbackForm.communication}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, communication: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select rating</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technical Skills
            </label>
            <select
              value={feedbackForm.technical}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, technical: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select rating</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall Experience
            </label>
            <select
              value={feedbackForm.overall}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, overall: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select rating</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any suggestions or feedback for improvement..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Company Portal</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Company Name</span>
              <button className="text-sm text-red-600 hover:text-red-800">Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'jobs', label: 'Job Management', icon: Briefcase },
              { id: 'recommendations', label: 'AI Recommendations', icon: Users },
              { id: 'results', label: 'Result Submission', icon: Upload }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'jobs' && <JobManagement />}
        {activeTab === 'recommendations' && <AIRecommendations />}
        {activeTab === 'results' && <ResultSubmission />}
      </main>
    </div>
  );
};