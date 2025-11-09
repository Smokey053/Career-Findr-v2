/**
 * Firebase Database Seed Script
 * This script populates the Firestore database with demo data for testing and presentation
 *
 * Usage: node scripts/seedDatabase.js
 *
 * Requirements:
 * - Firebase Admin SDK initialized with service account key
 * - serviceAccountKey.json in the root directory
 */

import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccountKeyPath = join(__dirname, "../serviceAccountKey.json");
const serviceAccountKey = JSON.parse(
  fs.readFileSync(serviceAccountKeyPath, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: `https://${serviceAccountKey.project_id}.firebaseio.com`,
});

const db = admin.firestore();
const auth = admin.auth();

// Demo data generators
const demoData = {
  adminUser: {
    uid: "admin-user-001",
    email: "admin@careerfinder.com",
    password: "Admin@123456",
    displayName: "Administrator",
    role: "admin",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  students: [
    {
      uid: "student-001",
      email: "john.doe@student.com",
      password: "Student@123456",
      displayName: "John Doe",
      role: "student",
      status: "active",
      phone: "+266 26123456",
      location: "Maseru",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      bio: "Passionate about full-stack development and building user-friendly applications.",
      profilePicture: null,
      cv: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: "student-002",
      email: "jane.smith@student.com",
      password: "Student@123456",
      displayName: "Jane Smith",
      role: "student",
      status: "active",
      phone: "+266 26234567",
      location: "Leribe",
      skills: ["Python", "Data Analysis", "SQL", "Tableau"],
      bio: "Data enthusiast looking to leverage analytics in business decisions.",
      profilePicture: null,
      cv: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: "student-003",
      email: "peter.wilson@student.com",
      password: "Student@123456",
      displayName: "Peter Wilson",
      role: "student",
      status: "active",
      phone: "+266 26345678",
      location: "Mafeteng",
      skills: ["Java", "Android", "Firebase", "REST APIs"],
      bio: "Mobile app developer interested in creating impactful applications.",
      profilePicture: null,
      cv: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  institutions: [
    {
      uid: "institution-001",
      email: "info@nationalu.ls",
      password: "Institution@123456",
      displayName: "National University of Lesotho",
      role: "institute",
      status: "active",
      institutionName: "National University of Lesotho",
      registrationNumber: "NUL-2020-001",
      location: "Maseru",
      phone: "+266 22341896",
      website: "https://www.nul.ls",
      description:
        "Leading institution providing quality higher education in various fields.",
      logo: null,
      verificationStatus: "verified",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: "institution-002",
      email: "contact@letie.edu.ls",
      password: "Institution@123456",
      displayName: "Lesotho Technical Institute of Education",
      role: "institute",
      status: "active",
      institutionName: "Lesotho Technical Institute of Education",
      registrationNumber: "LETIE-2021-002",
      location: "Leribe",
      phone: "+266 22345678",
      website: "https://www.letie.edu.ls",
      description: "Technical and vocational education provider.",
      logo: null,
      verificationStatus: "verified",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  companies: [
    {
      uid: "company-001",
      email: "careers@techcorp.ls",
      password: "Company@123456",
      displayName: "Tech Corporation Lesotho",
      role: "company",
      status: "active",
      companyName: "Tech Corporation Lesotho",
      registrationNumber: "TCL-2019-001",
      location: "Maseru",
      phone: "+266 26111222",
      website: "https://www.techcorp.ls",
      description:
        "Leading technology company providing innovative solutions and professional services.",
      logo: null,
      industry: "Technology",
      companySize: "50-200",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: "company-002",
      email: "jobs@financepro.com",
      password: "Company@123456",
      displayName: "Finance Pro Services",
      role: "company",
      status: "active",
      companyName: "Finance Pro Services",
      registrationNumber: "FPS-2020-002",
      location: "Maseru",
      phone: "+266 26222333",
      website: "https://www.financepro.com",
      description: "Financial consulting and advisory services company.",
      logo: null,
      industry: "Finance",
      companySize: "20-50",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  courses: [
    {
      institutionId: "institution-001",
      name: "Bachelor of Science in Computer Science",
      code: "CS101",
      field: "Computer Science",
      level: "Undergraduate",
      duration: "4 years",
      description:
        "Comprehensive program covering software development, algorithms, databases, and web technologies.",
      location: "Maseru",
      tuition: 85000,
      startDate: new Date("2024-09-01"),
      applicationDeadline: new Date("2024-08-31"),
      capacity: 100,
      enrolled: 45,
      status: "active",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-001",
      name: "Master of Business Administration",
      code: "MBA101",
      field: "Business",
      level: "Postgraduate",
      duration: "2 years",
      description:
        "Advanced management program with focus on entrepreneurship and strategic planning.",
      location: "Maseru",
      tuition: 120000,
      startDate: new Date("2024-09-15"),
      applicationDeadline: new Date("2024-09-10"),
      capacity: 50,
      enrolled: 28,
      status: "active",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-002",
      name: "Diploma in Electrical Engineering",
      code: "EE201",
      field: "Engineering",
      level: "Diploma",
      duration: "3 years",
      description:
        "Technical program covering power systems, electronics, and industrial applications.",
      location: "Leribe",
      tuition: 65000,
      startDate: new Date("2024-10-01"),
      applicationDeadline: new Date("2024-09-30"),
      capacity: 75,
      enrolled: 52,
      status: "active",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-001",
      name: "Bachelor of Science in Nursing",
      code: "NUR102",
      field: "Medicine",
      level: "Undergraduate",
      duration: "4 years",
      description:
        "Professional nursing program with clinical practice and community health focus.",
      location: "Maseru",
      tuition: 95000,
      startDate: new Date("2024-09-01"),
      applicationDeadline: new Date("2024-08-25"),
      capacity: 80,
      enrolled: 38,
      status: "active",
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  jobs: [
    {
      companyId: "company-001",
      title: "Senior Full Stack Developer",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 45000,
      salaryMax: 65000,
      experienceLevel: "Senior Level",
      description:
        "We are looking for an experienced full stack developer to lead our web development team. You will work with modern technologies and lead a team of junior developers.",
      requirements: [
        "5+ years of web development experience",
        "Proficiency in JavaScript, React, and Node.js",
        "Experience with MongoDB or PostgreSQL",
        "Strong problem-solving skills",
      ],
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "REST APIs"],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Professional development",
      ],
      status: "active",
      applicationDeadline: new Date("2024-12-31"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-001",
      title: "Junior Software Developer",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 20000,
      salaryMax: 30000,
      experienceLevel: "Entry Level",
      description:
        "Join our team as a junior developer! You will be mentored by senior developers and contribute to exciting projects using modern web technologies.",
      requirements: [
        "Recent graduate or 0-2 years experience",
        "Knowledge of HTML, CSS, JavaScript",
        "Familiarity with version control (Git)",
        "Eager to learn and improve",
      ],
      skills: ["JavaScript", "React", "HTML/CSS", "Git"],
      benefits: ["Mentorship", "Training opportunities", "Flexible hours"],
      status: "active",
      applicationDeadline: new Date("2024-12-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-002",
      title: "Financial Analyst",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 35000,
      salaryMax: 50000,
      experienceLevel: "Mid Level",
      description:
        "Seeking a financial analyst to support our client advisory services. Analyze financial data and provide insights to help client decision-making.",
      requirements: [
        "3+ years of financial analysis experience",
        "Proficiency in Excel and financial modeling",
        "Knowledge of financial statements",
        "Excellent communication skills",
      ],
      skills: ["Financial Analysis", "Excel", "Python", "SQL"],
      benefits: ["Performance bonus", "Health insurance", "Pension"],
      status: "active",
      applicationDeadline: new Date("2024-12-20"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-002",
      title: "Accounting Clerk",
      type: "Part-Time",
      location: "Maseru",
      salaryMin: 12000,
      salaryMax: 18000,
      experienceLevel: "Entry Level",
      description:
        "Looking for detail-oriented accounting clerk to assist with accounts payable and receivable processes.",
      requirements: [
        "High school diploma or equivalent",
        "Basic knowledge of accounting",
        "Proficiency in Excel",
        "Strong organizational skills",
      ],
      skills: ["Accounting", "Excel", "Data Entry", "Communication"],
      benefits: ["Flexible schedule", "Training provided", "Casual dress"],
      status: "active",
      applicationDeadline: new Date("2024-12-10"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  applications: [
    {
      studentId: "student-001",
      type: "course",
      courseId: "course-001",
      institutionId: "institution-001",
      status: "approved",
      appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      studentId: "student-002",
      type: "course",
      courseId: "course-002",
      institutionId: "institution-001",
      status: "pending",
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      studentId: "student-001",
      type: "job",
      jobId: "job-001",
      companyId: "company-001",
      status: "pending",
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      studentId: "student-003",
      type: "job",
      jobId: "job-002",
      companyId: "company-001",
      status: "interviewing",
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],

  admissions: [
    {
      applicationId: "admission-001",
      studentId: "student-001",
      institutionId: "institution-001",
      courseId: "course-001",
      status: "accepted",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
};

// Seed functions
async function seedAdminUser() {
  console.log("\n📝 Seeding admin user...");
  try {
    // Create auth user
    const adminAuthUser = await auth.createUser({
      uid: demoData.adminUser.uid,
      email: demoData.adminUser.email,
      password: demoData.adminUser.password,
      displayName: demoData.adminUser.displayName,
      emailVerified: true,
    });

    // Create Firestore document
    await db.collection("users").doc(demoData.adminUser.uid).set({
      uid: demoData.adminUser.uid,
      email: demoData.adminUser.email,
      displayName: demoData.adminUser.displayName,
      role: "admin",
      status: "active",
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${demoData.adminUser.email}`);
    console.log(`   Password: ${demoData.adminUser.password}`);
  } catch (error) {
    if (error.code === "auth/uid-already-exists") {
      console.log("⚠️  Admin user already exists, skipping creation");
    } else {
      throw error;
    }
  }
}

async function createAuthUser(userData) {
  try {
    const authUser = await auth.createUser({
      uid: userData.uid,
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: true,
    });
    return authUser;
  } catch (error) {
    if (error.code === "auth/uid-already-exists") {
      console.log(
        `⚠️  User ${userData.email} already exists, skipping auth creation`
      );
      return null;
    }
    throw error;
  }
}

async function seedStudents() {
  console.log("\n👥 Seeding students...");
  let counter = 0;

  for (const student of demoData.students) {
    try {
      await createAuthUser(student);

      await db.collection("users").doc(student.uid).set({
        uid: student.uid,
        email: student.email,
        displayName: student.displayName,
        role: "student",
        status: "active",
        phone: student.phone,
        location: student.location,
        skills: student.skills,
        bio: student.bio,
        profilePicture: null,
        cv: null,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      counter++;
    } catch (error) {
      console.error(`Error creating student ${student.email}:`, error.message);
    }
  }

  console.log(`✅ ${counter}/${demoData.students.length} students created`);
}

async function seedInstitutions() {
  console.log("\n🏫 Seeding institutions...");
  let counter = 0;

  for (const institution of demoData.institutions) {
    try {
      await createAuthUser(institution);

      await db.collection("users").doc(institution.uid).set({
        uid: institution.uid,
        email: institution.email,
        displayName: institution.displayName,
        role: "institute",
        status: "active",
        institutionName: institution.institutionName,
        registrationNumber: institution.registrationNumber,
        location: institution.location,
        phone: institution.phone,
        website: institution.website,
        description: institution.description,
        logo: null,
        verificationStatus: "verified",
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      counter++;
    } catch (error) {
      console.error(
        `Error creating institution ${institution.email}:`,
        error.message
      );
    }
  }

  console.log(
    `✅ ${counter}/${demoData.institutions.length} institutions created`
  );
}

async function seedCompanies() {
  console.log("\n🏢 Seeding companies...");
  let counter = 0;

  for (const company of demoData.companies) {
    try {
      await createAuthUser(company);

      await db.collection("users").doc(company.uid).set({
        uid: company.uid,
        email: company.email,
        displayName: company.displayName,
        role: "company",
        status: "active",
        companyName: company.companyName,
        registrationNumber: company.registrationNumber,
        location: company.location,
        phone: company.phone,
        website: company.website,
        description: company.description,
        logo: null,
        industry: company.industry,
        companySize: company.companySize,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      counter++;
    } catch (error) {
      console.error(`Error creating company ${company.email}:`, error.message);
    }
  }

  console.log(`✅ ${counter}/${demoData.companies.length} companies created`);
}

async function seedCourses() {
  console.log("\n📚 Seeding courses...");
  let counter = 0;

  for (const course of demoData.courses) {
    try {
      const docRef = await db.collection("courses").add({
        ...course,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      // Store the ID for later reference
      if (counter === 0) {
        demoData.courseIds = demoData.courseIds || [];
        demoData.courseIds.push(docRef.id);
      }

      counter++;
    } catch (error) {
      console.error(`Error creating course:`, error.message);
    }
  }

  console.log(`✅ ${counter}/${demoData.courses.length} courses created`);
}

async function seedJobs() {
  console.log("\n💼 Seeding jobs...");
  let counter = 0;

  for (const job of demoData.jobs) {
    try {
      const docRef = await db.collection("jobs").add({
        ...job,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      if (counter === 0) {
        demoData.jobIds = demoData.jobIds || [];
        demoData.jobIds.push(docRef.id);
      }

      counter++;
    } catch (error) {
      console.error(`Error creating job:`, error.message);
    }
  }

  console.log(`✅ ${counter}/${demoData.jobs.length} jobs created`);
}

async function seedApplications() {
  console.log("\n📋 Seeding applications...");
  let counter = 0;

  for (const application of demoData.applications) {
    try {
      await db.collection("applications").add({
        ...application,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      counter++;
    } catch (error) {
      console.error(`Error creating application:`, error.message);
    }
  }

  console.log(
    `✅ ${counter}/${demoData.applications.length} applications created`
  );
}

async function seedAdmissions() {
  console.log("\n✅ Seeding admissions...");
  let counter = 0;

  for (const admission of demoData.admissions) {
    try {
      await db.collection("admissions").add({
        ...admission,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      });

      counter++;
    } catch (error) {
      console.error(`Error creating admission:`, error.message);
    }
  }

  console.log(`✅ ${counter}/${demoData.admissions.length} admissions created`);
}

// Main seed function
async function seedDatabase() {
  console.log("🌱 Starting database seed...");
  console.log("=====================================\n");

  try {
    await seedAdminUser();
    await seedStudents();
    await seedInstitutions();
    await seedCompanies();
    await seedCourses();
    await seedJobs();
    await seedApplications();
    await seedAdmissions();

    console.log("\n=====================================");
    console.log("✅ Database seeding completed successfully!\n");
    console.log("📝 Demo Account Credentials:");
    console.log("=====================================");
    console.log(`\n🔐 ADMIN ACCOUNT:`);
    console.log(`   Email: ${demoData.adminUser.email}`);
    console.log(`   Password: ${demoData.adminUser.password}`);
    console.log(`\n👨‍🎓 STUDENT ACCOUNTS:`);
    demoData.students.forEach((student) => {
      console.log(`   Email: ${student.email}`);
      console.log(`   Password: ${student.password}`);
      console.log(`   Name: ${student.displayName}\n`);
    });
    console.log(`🏫 INSTITUTION ACCOUNTS:`);
    demoData.institutions.forEach((institution) => {
      console.log(`   Email: ${institution.email}`);
      console.log(`   Password: ${institution.password}`);
      console.log(`   Name: ${institution.displayName}\n`);
    });
    console.log(`🏢 COMPANY ACCOUNTS:`);
    demoData.companies.forEach((company) => {
      console.log(`   Email: ${company.email}`);
      console.log(`   Password: ${company.password}`);
      console.log(`   Name: ${company.displayName}\n`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed
seedDatabase();
