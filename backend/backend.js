// server.js - Main Express Server with Prisma
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Hash password helper
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { id, pw } = req.body;
  let usr = null;

  try {
    // admin user check
    usr = await prisma.tNPAdmin.findFirst({
      where: {
        OR: [
          { email: id },
          { username: id }
        ]
      }
    });

    if (usr != null) {
      const isMatch = await bcrypt.compare(pw, usr.password);
      if (!isMatch) {
        return res.json({ status: "error", message: "Password Error" });
      } else {
        const token = jwt.sign(
          { id: usr.username, name: usr.fullName, role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        
        // Update last login
        await prisma.tNPAdmin.update({
          where: { id: usr.id },
          data: { lastLogin: new Date() }
        });
        
        return res.json({ status: "success", token });
      }
    }

    // company user check
    usr = await prisma.company.findFirst({
      where: {
        OR: [
          { hrEmail: id },
          { id: id }
        ]
      }
    });

    if (usr != null) {
      const isMatch = await bcrypt.compare(pw, usr.password);
      if (!isMatch) {
        return res.json({ status: "error", message: "Password Error" });
      } else {
        const token = jwt.sign(
          { id: usr.id, name: usr.name, role: "company" },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        
        // Update last login
        await prisma.company.update({
          where: { id: usr.id },
          data: { lastLogin: new Date() }
        });
        
        return res.json({ status: "success", token });
      }
    }

    // student user check
    usr = await prisma.student.findFirst({
      where: {
        OR: [
          { email: id },
          { studentId: id }
        ]
      }
    });

    if (usr != null) {
      const isMatch = await bcrypt.compare(pw, usr.password);
      if (!isMatch) {
        return res.json({ status: "error", message: "Password Error" });
      } else {
        const token = jwt.sign(
          { id: usr.studentId, name: usr.name, role: "student" },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        
        // Update last login
        await prisma.student.update({
          where: { id: usr.id },
          data: { lastLogin: new Date() }
        });
        
        return res.json({ status: "success", token });
      }
    }

    return res.json({ status: "error", message: "no user" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
});

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

    const company = await prisma.company.findUnique({
      where: { id: id }
    });

    if (!company) {
      return res.status(404).json({ status: "error", message: "Company not found" });
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: company.id }
    });

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

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ status: "error", message: "Company not found" });
    }

    // If _id is provided, update existing job
    if (_id) {
      const updatedJob = await prisma.job.update({
        where: { id: _id },
        data: {
          title,
          description,
          role: eligibility,
          skillsRequired: skills ? skills.split(',').map(skill => skill.trim()) : [],
          packageMin: parseInt(ctc) || 0,
          location,
          applicationDeadline: deadline ? new Date(deadline) : null
        }
      });

      return res.json({ status: "success", job: updatedJob });
    }

    // Create new job
    const jobCount = await prisma.job.count();
    const jobId = generateId("JOB", jobCount);

    const newJob = await prisma.job.create({
      data: {
        jobId,
        companyId: company.id,
        companyName: company.name,
        title,
        description,
        role: eligibility,
        skillsRequired: skills ? skills.split(',').map(skill => skill.trim()) : [],
        location,
        packageMin: parseInt(ctc) || 0,
        applicationDeadline: deadline ? new Date(deadline) : null
      }
    });

    res.json({ status: "success", job: newJob });
  } catch (error) {
    console.error("Error creating/updating job:", error);
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
});

// Get all companies (Admin only)
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        hrName: true,
        hrEmail: true,
        hrPhone: true,
        industry: true,
        website: true,
        address: true,
        roles: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single company
app.get("/api/companies/:id", authMiddleware, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        hrName: true,
        hrEmail: true,
        hrPhone: true,
        industry: true,
        website: true,
        address: true,
        roles: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });
    
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
    const count = await prisma.company.count();
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

    const hashedPassword = await hashPassword(id);

    const company = await prisma.company.create({
      data: {
        id,
        name,
        hrName,
        hrEmail,
        hrPhone,
        password: hashedPassword,
        industry,
        website,
        address,
        roles: roles || []
      }
    });

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

    const company = await prisma.company.update({
      where: { id: req.params.id },
      data: {
        name,
        hrName,
        hrEmail,
        hrPhone,
        industry,
        website,
        address,
        roles: roles || [],
        status
      },
      select: {
        id: true,
        name: true,
        hrName: true,
        hrEmail: true,
        hrPhone: true,
        industry: true,
        website: true,
        address: true,
        roles: true,
        status: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json(company);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete company (Admin only)
app.delete("/api/companies/:id", async (req, res) => {
  try {
    await prisma.company.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== STUDENT ROUTES ====================

// Get all students (Admin only)
app.get("/api/students", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, branch, isPlaced } = req.query;
    const where = {};

    if (status) where.status = status;
    if (branch) where.branch = branch;
    if (isPlaced !== undefined) where.isPlaced = isPlaced === "true";

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        semester: true,
        phone: true,
        dateOfBirth: true,
        address: true,
        resumeLink: true,
        skills: true,
        certifications: true,
        status: true,
        isPlaced: true,
        placedCompany: true,
        placedRole: true,
        placedPackage: true,
        backlogs: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        createdAt: true,
        lastLogin: true
      }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single student
app.get("/api/students/:id", authMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        semester: true,
        phone: true,
        dateOfBirth: true,
        address: true,
        resumeLink: true,
        skills: true,
        certifications: true,
        status: true,
        isPlaced: true,
        placedCompany: true,
        placedRole: true,
        placedPackage: true,
        backlogs: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        createdAt: true,
        lastLogin: true
      }
    });
    
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
    const count = await prisma.student.count();
    const studentId = generateId("STU", count);

    const hashedPassword = await hashPassword(studentId);

    const studentData = {
      studentId,
      ...req.body,
      password: hashedPassword,
      skills: req.body.skills || [],
      certifications: req.body.certifications || []
    };

    const student = await prisma.student.create({
      data: studentData
    });

    res.json({
      status: "success",
      message: "Student created successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: "Server error", error: error.message });
  }
});

// Bulk upload students (Admin only)
app.post("/api/students/bulk", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { students } = req.body;
    const count = await prisma.student.count();

    const studentsToInsert = await Promise.all(
      students.map(async (student, index) => {
        const studentId = generateId("STU", count + index);
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await hashPassword(password);
        
        return {
          studentId,
          password: hashedPassword,
          ...student,
          skills: student.skills || [],
          certifications: student.certifications || []
        };
      })
    );

    const result = await prisma.student.createMany({
      data: studentsToInsert
    });
    
    res.status(201).json({
      message: `${result.count} students created successfully`,
      count: result.count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update student (Admin only)
app.put("/api/students/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: req.body,
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        semester: true,
        phone: true,
        dateOfBirth: true,
        address: true,
        resumeLink: true,
        skills: true,
        certifications: true,
        status: true,
        isPlaced: true,
        placedCompany: true,
        placedRole: true,
        placedPackage: true,
        backlogs: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json(student);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Approve student (Admin only)
app.patch("/api/students/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: { status: "Approved" },
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        semester: true,
        phone: true,
        dateOfBirth: true,
        address: true,
        resumeLink: true,
        skills: true,
        certifications: true,
        status: true,
        isPlaced: true,
        placedCompany: true,
        placedRole: true,
        placedPackage: true,
        backlogs: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json(student);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Disable student (Admin only)
app.patch("/api/students/:id/disable", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: { status: "Disabled" },
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        branch: true,
        cgpa: true,
        semester: true,
        phone: true,
        dateOfBirth: true,
        address: true,
        resumeLink: true,
        skills: true,
        certifications: true,
        status: true,
        isPlaced: true,
        placedCompany: true,
        placedRole: true,
        placedPackage: true,
        backlogs: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json(student);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete student (Admin only)
app.delete("/api/students/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== DRIVE ROUTES ====================

// Get all drives
app.get("/api/drives", async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const drives = await prisma.drive.findMany({
      where,
      include: {
        registeredStudents: {
          select: {
            id: true,
            name: true,
            studentId: true,
            branch: true,
            cgpa: true
          }
        }
      },
      orderBy: {
        driveDate: 'desc'
      }
    });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/companydrives", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const drives = await prisma.drive.findMany({
      where: { company: id }
    });
    res.status(200).json(drives);
  } catch (error) {
    console.error("Error fetching company drives:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single drive
app.get("/api/drives/:id", async (req, res) => {
  try {
    const drive = await prisma.drive.findUnique({
      where: { id: req.params.id },
      include: {
        registeredStudents: {
          select: {
            id: true,
            name: true,
            studentId: true,
            branch: true,
            cgpa: true,
            email: true
          }
        },
        shortlistedStudents: {
          select: {
            id: true,
            name: true,
            studentId: true,
            branch: true,
            cgpa: true
          }
        },
        selectedStudents: {
          select: {
            id: true,
            name: true,
            studentId: true,
            branch: true,
            cgpa: true
          }
        }
      }
    });

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
    const count = await prisma.drive.count();
    const driveId = generateId("DRV", count);
    
    const company = await prisma.company.findUnique({
      where: { id: req.body.company }
    });
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    const drive = await prisma.drive.create({
      data: {
        driveId,
        ...req.body,
        companyName: company.name,
        eligibilityCriteria: req.body.eligibilityCriteria || {},
        roles: req.body.roles || [],
        rounds: req.body.rounds || []
      }
    });
    
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update drive (Admin only)
app.put("/api/drives/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const drive = await prisma.drive.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        updatedAt: new Date()
      }
    });

    res.json(drive);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Register student for drive
app.post("/api/drives/:id/register", authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    const drive = await prisma.drive.findUnique({
      where: { id: req.params.id },
      include: {
        registeredStudents: true
      }
    });
    
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });
    
    if (!student || student.status !== "Approved") {
      return res.status(400).json({ message: "Student not eligible" });
    }

    // Check eligibility
    const criteria = drive.eligibilityCriteria;
    if (criteria.minCGPA && student.cgpa < criteria.minCGPA) {
      return res.status(400).json({ message: "CGPA requirement not met" });
    }

    if (criteria.branches && !criteria.branches.includes(student.branch)) {
      return res.status(400).json({ message: "Branch not eligible" });
    }

    if (criteria.maxBacklogs && student.backlogs > criteria.maxBacklogs) {
      return res.status(400).json({ message: "Too many backlogs" });
    }

    if (drive.registeredStudents.some(s => s.id === studentId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    const updatedDrive = await prisma.drive.update({
      where: { id: req.params.id },
      data: {
        registeredStudents: {
          connect: { id: studentId }
        }
      },
      include: {
        registeredStudents: true
      }
    });

    res.json({ message: "Registration successful", drive: updatedDrive });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Upload drive results (Admin only)
app.post("/api/drives/:id/results", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { shortlistedStudents, selectedStudents } = req.body;

    const drive = await prisma.drive.update({
      where: { id: req.params.id },
      data: {
        shortlistedStudents: {
          set: shortlistedStudents.map(id => ({ id }))
        },
        selectedStudents: {
          set: selectedStudents.map(id => ({ id }))
        },
        status: "Completed",
        updatedAt: new Date()
      },
      include: {
        selectedStudents: true
      }
    });

    // Update placed students
    if (selectedStudents && selectedStudents.length > 0) {
      await prisma.student.updateMany({
        where: {
          id: { in: selectedStudents }
        },
        data: {
          isPlaced: true,
          placedCompany: drive.companyName,
          placedRole: drive.roles[0]
        }
      });
    }

    res.json(drive);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete drive (Admin only)
app.delete("/api/drives/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.drive.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Drive deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== JOB ROUTES ====================

// Get all jobs
app.get("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const { isActive, jobType } = req.query;
    const where = {};

    if (isActive !== undefined) where.isActive = isActive === "true";
    if (jobType) where.jobType = jobType;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: {
          select: {
            name: true,
            hrName: true,
            hrEmail: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single job
app.get("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        company: {
          select: {
            name: true,
            hrName: true,
            hrEmail: true,
            website: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update job
app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(job);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete job
app.delete("/api/jobs/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== PLACEMENT REPORT ROUTES ====================

// Get all reports (Admin only)
app.get("/api/reports", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reports = await prisma.placementReport.findMany({
      include: {
        generatedBy: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      }
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single report
app.get("/api/reports/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const report = await prisma.placementReport.findUnique({
      where: { id: req.params.id },
      include: {
        generatedBy: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Generate placement report (Admin only)
app.post("/api/reports/generate", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { academicYear, semester } = req.body;

    // Calculate statistics
    const totalStudents = await prisma.student.count();
    const placedStudents = await prisma.student.findMany({
      where: { isPlaced: true }
    });
    const studentsPlaced = placedStudents.length;
    const companiesParticipated = await prisma.company.count({
      where: { status: "Active" }
    });
    const drivesOrganized = await prisma.drive.count({
      where: { status: "Completed" }
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
        const total = await prisma.student.count({ where: { branch } });
        const placed = await prisma.student.count({
          where: { branch, isPlaced: true }
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

    const count = await prisma.placementReport.count();
    const reportId = generateId("RPT", count);

    // Find admin user
    const admin = await prisma.tNPAdmin.findFirst({
      where: { username: req.user.id }
    });

    const report = await prisma.placementReport.create({
      data: {
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
        generatedById: admin.id
      }
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete report (Admin only)
app.delete("/api/reports/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.placementReport.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== DASHBOARD STATS ROUTES ====================

// Get dashboard statistics (Admin only)
app.get("/api/dashboard/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const approvedStudents = await prisma.student.count({
      where: { status: "Approved" }
    });
    const pendingStudents = await prisma.student.count({
      where: { status: "Pending" }
    });
    const placedStudents = await prisma.student.count({
      where: { isPlaced: true }
    });

    const totalCompanies = await prisma.company.count();
    const activeCompanies = await prisma.company.count({
      where: { status: "Active" }
    });

    const totalDrives = await prisma.drive.count();
    const scheduledDrives = await prisma.drive.count({
      where: { status: "Scheduled" }
    });
    const ongoingDrives = await prisma.drive.count({
      where: { status: "Ongoing" }
    });
    const completedDrives = await prisma.drive.count({
      where: { status: "Completed" }
    });

    const activeJobs = await prisma.job.count({
      where: { isActive: true }
    });

    // Placement percentage
    const placementPercentage =
      totalStudents > 0
        ? ((placedStudents / totalStudents) * 100).toFixed(2)
        : 0;

    // Recent activities
    const recentDrives = await prisma.drive.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        driveId: true,
        title: true,
        companyName: true,
        driveDate: true,
        status: true
      }
    });

    const recentStudents = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        studentId: true,
        branch: true,
        status: true
      }
    });

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
});

// Get placement analytics (Admin only)
app.get("/api/dashboard/analytics", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Placements by branch
    const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE"];
    const placementsByBranch = await Promise.all(
      branches.map(async (branch) => {
        const total = await prisma.student.count({ where: { branch } });
        const placed = await prisma.student.count({
          where: { branch, isPlaced: true }
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
    const companies = await prisma.company.findMany({
      where: { status: "Active" },
      select: { id: true, name: true },
      take: 10
    });

    const companyParticipation = await Promise.all(
      companies.map(async (company) => {
        const drives = await prisma.drive.count({
          where: {
            company: company.id,
            status: "Completed"
          }
        });
        const placed = await prisma.student.count({
          where: { placedCompany: company.name }
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

      const drivesCompleted = await prisma.drive.count({
        where: {
          status: "Completed",
          driveDate: {
            gte: monthStart,
            lte: monthEnd
          }
        }
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
    const placedStudentsWithPackage = await prisma.student.findMany({
      where: {
        isPlaced: true,
        placedPackage: { not: null }
      }
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
});

app.post("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    const adminId = req.user.id;

    // Destructure fields from request body
    const { fullName, phone, email } = req.body;

    // Find the admin by username
    const admin = await prisma.tNPAdmin.findFirst({
      where: { username: adminId }
    });
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update allowed fields
    const updatedAdmin = await prisma.tNPAdmin.update({
      where: { id: admin.id },
      data: {
        fullName: fullName || admin.fullName,
        phone: phone || admin.phone,
        email: email || admin.email
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json({ message: "Profile updated successfully", admin: updatedAdmin });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});