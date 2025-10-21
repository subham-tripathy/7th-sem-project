// server.js - Main Express Server
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ==================== MODELS ====================

// TNP Admin Model
const TNPAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

TNPAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const TNPAdmin = mongoose.model("TNPAdmin", TNPAdminSchema);

// Company Model
const CompanySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hrName: { type: String, required: true },
  hrEmail: { type: String, required: true },
  hrPhone: String,
  password: { type: String, required: true },
  industry: String,
  website: String,
  address: String,
  roles: [String],
  status: {
    type: String,
    enum: ["Active", "Inactive", "Blocked"],
    default: "Active",
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

CompanySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Company = mongoose.model("Company", CompanySchema);

// Student Model
const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, required: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 },
  semester: { type: Number, min: 1, max: 8 },
  phone: String,
  dateOfBirth: Date,
  address: String,
  resumeLink: String,
  skills: [String],
  certifications: [String],
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected", "Disabled"],
    default: "Pending",
  },
  isPlaced: { type: Boolean, default: false },
  placedCompany: String,
  placedRole: String,
  placedPackage: Number,
  backlogs: { type: Number, default: 0 },
  tenthPercentage: Number,
  twelfthPercentage: Number,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Student = mongoose.model("Student", StudentSchema);

// Drive Model
const DriveSchema = new mongoose.Schema({
  driveId: { type: String, required: true, unique: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  companyName: String,
  title: { type: String, required: true },
  description: String,
  roles: [String],
  eligibilityCriteria: {
    minCGPA: { type: Number, default: 0 },
    branches: [String],
    maxBacklogs: { type: Number, default: 0 },
    minTenthPercentage: Number,
    minTwelfthPercentage: Number,
  },
  driveDate: { type: Date, required: true },
  registrationDeadline: Date,
  venue: String,
  rounds: [
    {
      roundName: String,
      roundDate: Date,
      roundType: {
        type: String,
        enum: [
          "Online Test",
          "Technical",
          "HR",
          "Group Discussion",
        ],
      },
    },
  ],
  registeredStudents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  ],
  shortlistedStudents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  ],
  selectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  status: {
    type: String,
    enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Drive = mongoose.model("Drive", DriveSchema);

// Job Model
const JobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  companyName: String,
  title: { type: String, required: true },
  description: String,
  role: String,
  jobType: {
    type: String,
    enum: ["Full-time", "Internship", "Part-time", "Contract"],
  },
  location: String,
  package: {
    min: Number,
    max: Number,
    currency: { type: String, default: "INR" },
  },
  skillsRequired: [String],
  eligibilityCriteria: {
    minCGPA: Number,
    branches: [String],
    maxBacklogs: Number,
  },
  applicationDeadline: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", JobSchema);

// Placement Report Model
const PlacementReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  academicYear: { type: String, required: true },
  semester: String,
  totalStudents: { type: Number, required: true },
  studentsPlaced: { type: Number, required: true },
  companiesParticipated: { type: Number, required: true },
  drivesOrganized: { type: Number, required: true },
  highestPackage: Number,
  averagePackage: Number,
  lowestPackage: Number,
  placementsByBranch: [
    {
      branch: String,
      totalStudents: Number,
      placedStudents: Number,
      percentage: Number,
    },
  ],
  placementsByCompany: [
    {
      company: String,
      studentsPlaced: Number,
    },
  ],
  salaryDistribution: [
    {
      range: String,
      count: Number,
    },
  ],
  jobCategories: [
    {
      category: String,
      count: Number,
      percentage: Number,
    },
  ],
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "TNPAdmin" },
  generatedAt: { type: Date, default: Date.now },
});

const PlacementReport = mongoose.model(
  "PlacementReport",
  PlacementReportSchema
);

// ==================== MIDDLEWARE ====================

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Role Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// ==================== HELPER FUNCTIONS ====================

const generateId = (prefix, count) => {
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { id, pw } = req.body;
  let usr = null

  // admin user check
  usr = await TNPAdmin.findOne({ email: id }) || await TNPAdmin.findOne({ username: id })
  if (usr != null) {
    const isMatch = await bcrypt.compare(pw, usr.password);
    if (!isMatch) {
      return res.json({ status: "error", message: "Password Error" });
    } else {
      console.log()
      console.log(usr.username)
      console.log(usr.role)
      console.log()
      const token = jwt.sign(
        { id: usr.username, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.json({ status: "success", token });
    }
  }

  // company user check
  usr = await Company.findOne({ email: id }) || await Company.findOne({ id: id })
  if (usr != null) {
    const isMatch = await bcrypt.compare(pw, usr.password);
    if (!isMatch) {
      return res.json({ status: "error", message: "Password Error" });
    } else {
      const token = jwt.sign(
        { id: usr.id, role: "company" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.json({ status: "success", token });
    }
  }

  // student user check
  usr = await Student.findOne({ email: id }) || await Student.findOne({ studentId: id })
  if (usr != null) {
    const isMatch = await bcrypt.compare(pw, usr.password);
    if (!isMatch) {
      return res.json({ status: "error", message: "Password Error" });
    } else {
      const token = jwt.sign(
        { id: usr.studentId, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.json({ status: "success", token });
    }
  }

  return res.json({ status: "error", message: "no user" })
})

// ==================== AUTH ROUTES ====================

// ==================== COMPANY ROUTES ====================

// Get company features
app.get("/api/company/features", authMiddleware, async (req, res) => {
  try {
    // Check if user is a company
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Return available features for company dashboard
    const features = [
      {
        id: 1,
        title: "Manage Job Postings",
        urlText: "Post New Jobs",
        url: "/company/jobs"
      },
      {
        id: 2,
        title: "Schedule Campus Drives",
        urlText: "Schedule Drive",
        url: "/company/drives"
      },
      {
        id: 3,
        title: "View Student Profiles",
        urlText: "Browse Students",
        url: "/company/students"
      },
      {
        id: 4,
        title: "Company Profile",
        urlText: "Update Profile",
        url: "/company/profile"
      }
    ];
    
    res.json({ status: "success", features });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get job listings for a company
app.post("/api/getJobListings", async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ status: "error", message: "Company ID is required" });
    }
    
    const company = await Company.findOne({ id });
    
    if (!company) {
      return res.status(404).json({ status: "error", message: "Company not found" });
    }
    
    const jobs = await Job.find({ company: company._id });
    
    res.json({ status: "success", jobs });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
});

// Create or update job
app.post("/api/jobs", async (req, res) => {
  try {
    const { companyId, title, description, eligibility, skills, ctc, location, deadline, _id } = req.body;
    
    if (!companyId || !title) {
      return res.status(400).json({ status: "error", message: "Company ID and job title are required" });
    }
    
    const company = await Company.findOne({ id: companyId });
    
    if (!company) {
      return res.status(404).json({ status: "error", message: "Company not found" });
    }
    
    // If _id is provided, update existing job
    if (_id) {
      const updatedJob = await Job.findByIdAndUpdate(
        _id,
        {
          title,
          description,
          role: eligibility,
          skillsRequired: skills.split(',').map(skill => skill.trim()),
          package: { min: parseInt(ctc) || 0 },
          location,
          applicationDeadline: new Date(deadline),
          updatedAt: new Date()
        },
        { new: true }
      );
      
      return res.json({ status: "success", job: updatedJob });
    }
    
    // Create new job
    const jobCount = await Job.countDocuments();
    const jobId = generateId("JOB", jobCount);
    
    const newJob = new Job({
      jobId,
      company: company._id,
      companyName: company.name,
      title,
      description,
      role: eligibility,
      skillsRequired: skills ? skills.split(',').map(skill => skill.trim()) : [],
      location,
      package: { min: parseInt(ctc) || 0 },
      applicationDeadline: deadline ? new Date(deadline) : null
    });
    
    await newJob.save();
    
    res.json({ status: "success", job: newJob });
  } catch (error) {
    console.error("Error creating/updating job:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
});

// Get all companies (Admin only)
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find().select("-password");
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single company
app.get("/api/companies/:id", authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select("-password");
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new company (Admin only)
app.post("/api/companies", async (req, res) => {
  try {
    const count = await Company.countDocuments();
    const id = generateId("COMP", count);

    const {
      name,
      hrName,
      hrEmail,
      hrPhone,
      industry,
      website,
      address,
      roles,
    } = req.body;

    const company = new Company({
      id,
      name,
      hrName,
      hrEmail,
      hrPhone,
      password: id,
      industry,
      website,
      address,
      roles,
    });

    await company.save();

    res.json({ status: "success", message: "Company created successfully" });
  } catch (error) {
    res.json({ status: "error", message: "Server error", error: error.message });
  }
});

// Update company (Admin only)
app.put("/api/companies/:id", async (req, res) => {
  try {
    const {
      name,
      hrName,
      hrEmail,
      hrPhone,
      industry,
      website,
      address,
      roles,
      status,
    } = req.body;

    const company = await Company.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        hrName,
        hrEmail,
        hrPhone,
        industry,
        website,
        address,
        roles,
        status,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete company (Admin only)
app.delete(
  "/api/companies/:id",
  async (req, res) => {
    try {
      const company = await Company.findOneAndDelete({ id: req.params.id });
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== STUDENT ROUTES ====================

// Get all students (Admin only)
app.get("/api/students", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, branch, isPlaced } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (branch) filter.branch = branch;
    if (isPlaced !== undefined) filter.isPlaced = isPlaced === "true";

    const students = await Student.find(filter).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single student
app.get("/api/students/:id", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new student (Admin only)
app.post("/api/students", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const count = await Student.countDocuments();
    const studentId = generateId("STU", count);

    const studentData = {
      studentId,
      ...req.body,
      password: studentId,
    };

    const student = new Student(studentData);
    await student.save();

    res.json({
      status: "success",
      message: "Student created successfully",
    });
  } catch (error) {
    console.log(error)
    res.json({ status: "error", message: "Server error", error: error.message });
  }
});

// Bulk upload students (Admin only)
app.post(
  "/api/students/bulk",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { students } = req.body;
      const count = await Student.countDocuments();

      const studentsToInsert = students.map((student, index) => ({
        studentId: generateId("STU", count + index),
        password: Math.random().toString(36).slice(-8),
        ...student,
      }));

      const result = await Student.insertMany(studentsToInsert);
      res.status(201).json({
        message: `${result.length} students created successfully`,
        count: result.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update student (Admin only)
app.put(
  "/api/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Approve student (Admin only)
app.patch(
  "/api/students/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { status: "Approved" },
        { new: true }
      ).select("-password");

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Disable student (Admin only)
app.patch(
  "/api/students/:id/disable",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { status: "Disabled" },
        { new: true }
      ).select("-password");

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete student (Admin only)
app.delete(
  "/api/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== DRIVE ROUTES ====================

// Get all drives
app.get("/api/drives", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const drives = await Drive.find(filter)
      .populate("company", "name hrName hrEmail")
      .populate("registeredStudents", "name studentId branch cgpa")
      .sort({ driveDate: -1 });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single drive
app.get("/api/drives/:id", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate("company", "name hrName hrEmail")
      .populate("registeredStudents", "name studentId branch cgpa email")
      .populate("shortlistedStudents", "name studentId branch cgpa")
      .populate("selectedStudents", "name studentId branch cgpa");

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new drive (Admin only)
app.post("/api/drives", async (req, res) => {
  try {
    const count = await Drive.countDocuments();
    const driveId = generateId("DRV", count);

    const company = await Company.findOne({id:req.body.company});
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const drive = new Drive({
      driveId,
      ...req.body,
      companyName: company.name,
    });

    await drive.save();
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update drive (Admin only)
app.put(
  "/api/drives/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const drive = await Drive.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!drive) {
        return res.status(404).json({ message: "Drive not found" });
      }

      res.json(drive);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Register student for drive
app.post("/api/drives/:id/register", authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const student = await Student.findById(studentId);
    if (!student || student.status !== "Approved") {
      return res.status(400).json({ message: "Student not eligible" });
    }

    // Check eligibility
    if (student.cgpa < drive.eligibilityCriteria.minCGPA) {
      return res.status(400).json({ message: "CGPA requirement not met" });
    }

    if (!drive.eligibilityCriteria.branches.includes(student.branch)) {
      return res.status(400).json({ message: "Branch not eligible" });
    }

    if (student.backlogs > drive.eligibilityCriteria.maxBacklogs) {
      return res.status(400).json({ message: "Too many backlogs" });
    }

    if (drive.registeredStudents.includes(studentId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    drive.registeredStudents.push(studentId);
    await drive.save();

    res.json({ message: "Registration successful", drive });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Upload drive results (Admin only)
app.post(
  "/api/drives/:id/results",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { shortlistedStudents, selectedStudents } = req.body;

      const drive = await Drive.findByIdAndUpdate(
        req.params.id,
        {
          shortlistedStudents,
          selectedStudents,
          status: "Completed",
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!drive) {
        return res.status(404).json({ message: "Drive not found" });
      }

      // Update placed students
      if (selectedStudents && selectedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: selectedStudents } },
          {
            isPlaced: true,
            placedCompany: drive.companyName,
            placedRole: drive.roles[0],
          }
        );
      }

      res.json(drive);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete drive (Admin only)
app.delete(
  "/api/drives/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const drive = await Drive.findByIdAndDelete(req.params.id);
      if (!drive) {
        return res.status(404).json({ message: "Drive not found" });
      }
      res.json({ message: "Drive deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== JOB ROUTES ====================

// Get all jobs
app.get("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const { isActive, jobType } = req.query;
    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter)
      .populate("company", "name hrName hrEmail")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single job
app.get("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name hrName hrEmail website"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new job (Admin or Company)
app.post("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const count = await Job.countDocuments();
    const jobId = generateId("JOB", count);

    const company = await Company.findById(req.body.company);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const job = new Job({
      jobId,
      ...req.body,
      companyName: company.name,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update job
app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete job
app.delete(
  "/api/jobs/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== PLACEMENT REPORT ROUTES ====================

// Get all reports (Admin only)
app.get("/api/reports", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reports = await PlacementReport.find()
      .populate("generatedBy", "fullName email")
      .sort({ generatedAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single report
app.get(
  "/api/reports/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const report = await PlacementReport.findById(req.params.id).populate(
        "generatedBy",
        "fullName email"
      );

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Generate placement report (Admin only)
app.post(
  "/api/reports/generate",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { academicYear, semester } = req.body;

      // Calculate statistics
      const totalStudents = await Student.countDocuments();
      const placedStudents = await Student.find({ isPlaced: true });
      const studentsPlaced = placedStudents.length;
      const companiesParticipated = await Company.countDocuments({
        status: "Active",
      });
      const drivesOrganized = await Drive.countDocuments({
        status: "Completed",
      });

      // Calculate packages
      const packages = placedStudents
        .map((s) => s.placedPackage)
        .filter((p) => p !== undefined && p !== null);

      const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
      const lowestPackage = packages.length > 0 ? Math.min(...packages) : 0;
      const averagePackage =
        packages.length > 0
          ? packages.reduce((a, b) => a + b, 0) / packages.length
          : 0;

      // Placements by branch
      const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];
      const placementsByBranch = await Promise.all(
        branches.map(async (branch) => {
          const total = await Student.countDocuments({ branch });
          const placed = await Student.countDocuments({
            branch,
            isPlaced: true,
          });
          return {
            branch,
            totalStudents: total,
            placedStudents: placed,
            percentage: total > 0 ? (placed / total) * 100 : 0,
          };
        })
      );

      // Placements by company
      const companyPlacements = {};
      placedStudents.forEach((student) => {
        if (student.placedCompany) {
          companyPlacements[student.placedCompany] =
            (companyPlacements[student.placedCompany] || 0) + 1;
        }
      });

      const placementsByCompany = Object.entries(companyPlacements).map(
        ([company, count]) => ({
          company,
          studentsPlaced: count,
        })
      );

      // Salary distribution
      const salaryRanges = [
        { range: "0-3 LPA", min: 0, max: 3 },
        { range: "3-5 LPA", min: 3, max: 5 },
        { range: "5-7 LPA", min: 5, max: 7 },
        { range: "7-10 LPA", min: 7, max: 10 },
        { range: "10+ LPA", min: 10, max: Infinity },
      ];

      const salaryDistribution = salaryRanges.map(({ range, min, max }) => ({
        range,
        count: packages.filter((p) => p >= min && p < max).length,
      }));

      // Job categories (simplified)
      const jobCategories = [
        {
          category: "IT/Software",
          count: Math.floor(studentsPlaced * 0.45),
          percentage: 45,
        },
        {
          category: "Core Engineering",
          count: Math.floor(studentsPlaced * 0.25),
          percentage: 25,
        },
        {
          category: "Consulting",
          count: Math.floor(studentsPlaced * 0.15),
          percentage: 15,
        },
        {
          category: "Finance",
          count: Math.floor(studentsPlaced * 0.1),
          percentage: 10,
        },
        {
          category: "Others",
          count: Math.floor(studentsPlaced * 0.05),
          percentage: 5,
        },
      ];

      const count = await PlacementReport.countDocuments();
      const reportId = generateId("RPT", count);

      const report = new PlacementReport({
        reportId,
        academicYear,
        semester,
        totalStudents,
        studentsPlaced,
        companiesParticipated,
        drivesOrganized,
        highestPackage,
        averagePackage: parseFloat(averagePackage.toFixed(2)),
        lowestPackage,
        placementsByBranch,
        placementsByCompany,
        salaryDistribution,
        jobCategories,
        generatedBy: req.user.id,
      });

      await report.save();
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete report (Admin only)
app.delete(
  "/api/reports/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const report = await PlacementReport.findByIdAndDelete(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json({ message: "Report deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== DASHBOARD STATS ROUTES ====================

// Get dashboard statistics (Admin only)
app.get(
  "/api/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalStudents = await Student.countDocuments();
      const approvedStudents = await Student.countDocuments({
        status: "Approved",
      });
      const pendingStudents = await Student.countDocuments({
        status: "Pending",
      });
      const placedStudents = await Student.countDocuments({ isPlaced: true });

      const totalCompanies = await Company.countDocuments();
      const activeCompanies = await Company.countDocuments({
        status: "Active",
      });

      const totalDrives = await Drive.countDocuments();
      const scheduledDrives = await Drive.countDocuments({
        status: "Scheduled",
      });
      const ongoingDrives = await Drive.countDocuments({ status: "Ongoing" });
      const completedDrives = await Drive.countDocuments({
        status: "Completed",
      });

      const activeJobs = await Job.countDocuments({ isActive: true });

      // Placement percentage
      const placementPercentage =
        totalStudents > 0
          ? ((placedStudents / totalStudents) * 100).toFixed(2)
          : 0;

      // Recent activities
      const recentDrives = await Drive.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("company", "name");

      const recentStudents = await Student.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name studentId branch status");

      res.json({
        students: {
          total: totalStudents,
          approved: approvedStudents,
          pending: pendingStudents,
          placed: placedStudents,
          placementPercentage,
        },
        companies: {
          total: totalCompanies,
          active: activeCompanies,
        },
        drives: {
          total: totalDrives,
          scheduled: scheduledDrives,
          ongoing: ongoingDrives,
          completed: completedDrives,
        },
        jobs: {
          active: activeJobs,
        },
        recentActivities: {
          drives: recentDrives,
          students: recentStudents,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get placement analytics (Admin only)
app.get(
  "/api/dashboard/analytics",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Placements by branch
      const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];
      const placementsByBranch = await Promise.all(
        branches.map(async (branch) => {
          const total = await Student.countDocuments({ branch });
          const placed = await Student.countDocuments({
            branch,
            isPlaced: true,
          });
          return {
            branch,
            total,
            placed,
            percentage: total > 0 ? ((placed / total) * 100).toFixed(2) : 0,
          };
        })
      );

      // Company participation
      const companies = await Company.find({ status: "Active" })
        .select("name")
        .limit(10);

      const companyParticipation = await Promise.all(
        companies.map(async (company) => {
          const drives = await Drive.countDocuments({
            company: company._id,
            status: "Completed",
          });
          const placed = await Student.countDocuments({
            placedCompany: company.name,
          });
          return {
            company: company.name,
            drives,
            studentsPlaced: placed,
          };
        })
      );

      // Monthly placement trends (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const placementTrends = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const drivesCompleted = await Drive.countDocuments({
          status: "Completed",
          driveDate: { $gte: monthStart, $lte: monthEnd },
        });

        placementTrends.push({
          month: monthStart.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          drives: drivesCompleted,
        });
      }

      // Package statistics
      const placedStudentsWithPackage = await Student.find({
        isPlaced: true,
        placedPackage: { $exists: true },
      });
      const packages = placedStudentsWithPackage
        .map((s) => s.placedPackage)
        .filter((p) => p);

      const packageStats = {
        highest: packages.length > 0 ? Math.max(...packages) : 0,
        lowest: packages.length > 0 ? Math.min(...packages) : 0,
        average:
          packages.length > 0
            ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)
            : 0,
      };

      res.json({
        placementsByBranch,
        companyParticipation,
        placementTrends,
        packageStats,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

app.post("/api/getJobListings", async (req, res) => {
  const { id } = req.body;
  const jobListings = await Job
  res.json()
})

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});