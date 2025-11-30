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
import algoliasearch from "algoliasearch";

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

// Initialize Algolia (optional - only if credentials are provided)
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
let algoliaClient = null;
let jobsIndex = null;
let coursesIndex = null;

if (ALGOLIA_APP_ID && ALGOLIA_ADMIN_KEY) {
  algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  jobsIndex = algoliaClient.initIndex('jobs');
  coursesIndex = algoliaClient.initIndex('courses');
  console.log("✅ Algolia client initialized");
} else {
  console.log("⚠️  Algolia credentials not found. Skipping Algolia sync.");
  console.log("   Set ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY environment variables to enable.");
}

// Helper functions for dynamic dates
const now = new Date();
const currentYear = now.getFullYear();

// Get a date relative to today
const getRelativeDate = (daysFromNow) => {
  const date = new Date(now);
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// Get a date in the future for deadlines/start dates
const getFutureDate = (monthsFromNow, dayOfMonth = 1) => {
  const date = new Date(now);
  date.setMonth(date.getMonth() + monthsFromNow);
  date.setDate(dayOfMonth);
  return date;
};

// Demo data generators - Dynamic dates based on current date
const demoData = {
  adminUser: {
    uid: "admin-user-001",
    email: "admin@careerfindr.com",
    password: "admin123",
    displayName: "Administrator",
    name: "Administrator",
    role: "admin",
    status: "active",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  students: [
    {
      uid: "student-001",
      email: "john.doe@student.com",
      password: "Student@123456",
      displayName: "John Doe",
      name: "John Doe",
      role: "student",
      status: "active",
      emailVerified: true,
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
      name: "Jane Smith",
      role: "student",
      status: "active",
      emailVerified: true,
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
      name: "Peter Wilson",
      role: "student",
      status: "active",
      emailVerified: true,
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
      name: "National University of Lesotho",
      role: "institute",
      status: "active",
      emailVerified: true,
      institutionName: "National University of Lesotho",
      registrationNumber: "NUL-2020-001",
      location: "Maseru",
      phone: "+266 22341896",
      website: "https://www.nul.ls",
      description:
        "Leading institution providing quality higher education in various fields.",
      logo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uid: "institution-002",
      email: "contact@letie.edu.ls",
      password: "Institution@123456",
      displayName: "Lesotho Technical Institute of Education",
      name: "Lesotho Technical Institute of Education",
      role: "institute",
      status: "active",
      emailVerified: true,
      institutionName: "Lesotho Technical Institute of Education",
      registrationNumber: "LETIE-2021-002",
      location: "Leribe",
      phone: "+266 22345678",
      website: "https://www.letie.edu.ls",
      description: "Technical and vocational education provider.",
      logo: null,
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
      name: "Tech Corporation Lesotho",
      role: "company",
      status: "active",
      emailVerified: true,
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
      name: "Finance Pro Services",
      role: "company",
      status: "active",
      emailVerified: true,
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

  // Updated courses with dynamic dates
  courses: [
    {
      institutionId: "institution-001",
      institutionName: "National University of Lesotho",
      name: "Bachelor of Science in Computer Science",
      code: "CS101",
      field: "Computer Science",
      level: "Undergraduate",
      duration: "4 years",
      description:
        "Comprehensive program covering software development, algorithms, databases, and web technologies.",
      location: "Maseru",
      tuition: 85000,
      fees: 85000,
      currency: "LSL",
      startDate: getFutureDate(3, 1), // 3 months from now
      applicationDeadline: getFutureDate(2, 15), // 2 months from now
      capacity: 100,
      enrolled: 45,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-001",
      institutionName: "National University of Lesotho",
      name: "Master of Business Administration",
      code: "MBA101",
      field: "Business",
      level: "Postgraduate",
      duration: "2 years",
      description:
        "Advanced management program with focus on entrepreneurship and strategic planning.",
      location: "Maseru",
      tuition: 120000,
      fees: 120000,
      currency: "LSL",
      startDate: getFutureDate(4, 15), // 4 months from now
      applicationDeadline: getFutureDate(3, 30), // 3 months from now
      capacity: 50,
      enrolled: 28,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-002",
      institutionName: "Lesotho Technical Institute of Education",
      name: "Diploma in Electrical Engineering",
      code: "EE201",
      field: "Engineering",
      level: "Diploma",
      duration: "3 years",
      description:
        "Technical program covering power systems, electronics, and industrial applications.",
      location: "Leribe",
      tuition: 65000,
      fees: 65000,
      currency: "LSL",
      startDate: getFutureDate(5, 1), // 5 months from now
      applicationDeadline: getFutureDate(4, 15), // 4 months from now
      capacity: 75,
      enrolled: 52,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      institutionId: "institution-001",
      institutionName: "National University of Lesotho",
      name: "Bachelor of Science in Nursing",
      code: "NUR102",
      field: "Medicine",
      level: "Undergraduate",
      duration: "4 years",
      description:
        "Professional nursing program with clinical practice and community health focus.",
      location: "Maseru",
      tuition: 95000,
      fees: 95000,
      currency: "LSL",
      startDate: getFutureDate(3, 1), // 3 months from now
      applicationDeadline: getFutureDate(2, 10), // 2 months from now
      capacity: 80,
      enrolled: 38,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  // Updated jobs with dynamic dates
  jobs: [
    {
      companyId: "company-001",
      companyName: "Tech Corporation Lesotho",
      title: "Senior Full Stack Developer",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 45000,
      salaryMax: 65000,
      currency: "LSL",
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
      applicationDeadline: getFutureDate(2, 31), // ~2 months from now
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-001",
      companyName: "Tech Corporation Lesotho",
      title: "Junior Software Developer",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 20000,
      salaryMax: 30000,
      currency: "LSL",
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
      applicationDeadline: getFutureDate(1, 15), // ~1.5 months from now
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-002",
      companyName: "Finance Pro Services",
      title: "Financial Analyst",
      type: "Full-Time",
      location: "Maseru",
      salaryMin: 35000,
      salaryMax: 50000,
      currency: "LSL",
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
      applicationDeadline: getFutureDate(1, 20), // ~1.5 months from now
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "company-002",
      companyName: "Finance Pro Services",
      title: "Accounting Clerk",
      type: "Part-Time",
      location: "Maseru",
      salaryMin: 12000,
      salaryMax: 18000,
      currency: "LSL",
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
      applicationDeadline: getFutureDate(1, 10), // ~1 month from now
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
      courseName: "Bachelor of Science in Computer Science",
      institutionName: "National University of Lesotho",
      status: "approved",
      appliedAt: getRelativeDate(-30), // 30 days ago
      createdAt: getRelativeDate(-30),
      updatedAt: new Date(),
    },
    {
      studentId: "student-002",
      type: "course",
      courseId: "course-002",
      institutionId: "institution-001",
      courseName: "Master of Business Administration",
      institutionName: "National University of Lesotho",
      status: "pending",
      appliedAt: getRelativeDate(-10), // 10 days ago
      createdAt: getRelativeDate(-10),
      updatedAt: new Date(),
    },
    {
      studentId: "student-001",
      type: "job",
      jobId: "job-001",
      companyId: "company-001",
      jobTitle: "Senior Full Stack Developer",
      companyName: "Tech Corporation Lesotho",
      status: "pending",
      appliedAt: getRelativeDate(-5), // 5 days ago
      createdAt: getRelativeDate(-5),
      updatedAt: new Date(),
    },
    {
      studentId: "student-003",
      type: "job",
      jobId: "job-002",
      companyId: "company-001",
      jobTitle: "Junior Software Developer",
      companyName: "Tech Corporation Lesotho",
      status: "interviewing",
      appliedAt: getRelativeDate(-3), // 3 days ago
      createdAt: getRelativeDate(-3),
      updatedAt: new Date(),
    },
  ],

  admissions: [
    {
      applicationId: "application-001",
      studentId: "student-001",
      institutionId: "institution-001",
      courseId: "course-001",
      courseName: "Bachelor of Science in Computer Science",
      institutionName: "National University of Lesotho",
      status: "pending",
      createdAt: new Date(),
    },
  ],
};

// Helper function to create or update a user
async function createOrUpdateUser(userData) {
  try {
    // Try to get existing user
    try {
      await auth.getUser(userData.uid);
      console.log(
        `⚠️  User ${userData.email} already exists, skipping auth creation`
      );
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create new user
        await auth.createUser({
          uid: userData.uid,
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          emailVerified: true,
        });
        console.log(`✅ Created auth user: ${userData.email}`);
      } else {
        throw error;
      }
    }

    // Create or update Firestore document
    const { password, ...firestoreData } = userData;
    await db
      .collection("users")
      .doc(userData.uid)
      .set(firestoreData, { merge: true });

    return true;
  } catch (error) {
    console.error(
      `Error creating/updating user ${userData.email}:`,
      error.message
    );
    return false;
  }
}

// Main seeding function
async function seedDatabase() {
  console.log("🌱 Starting database seed...");
  console.log("=====================================\n");

  try {
    // Seed admin user
    console.log("📝 Seeding admin user...");
    const adminData = demoData.adminUser;
    try {
      await auth.getUser(adminData.uid);
      console.log(
        "⚠️  Admin UID already exists. Updating admin credentials to match docs..."
      );
      await auth.updateUser(adminData.uid, {
        email: adminData.email,
        password: adminData.password,
        displayName: adminData.displayName,
        emailVerified: true,
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        await auth.createUser({
          uid: adminData.uid,
          email: adminData.email,
          password: adminData.password,
          displayName: adminData.displayName,
          emailVerified: true,
        });
      }
    }
    const { password: adminPw, ...adminFirestoreData } = adminData;
    await db
      .collection("users")
      .doc(adminData.uid)
      .set(adminFirestoreData, { merge: true });
    console.log("✅ Admin credentials synced successfully");
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Password: ${adminData.password}\n`);

    // Seed students
    console.log("👥 Seeding students...");
    let studentCount = 0;
    for (const student of demoData.students) {
      if (await createOrUpdateUser(student)) studentCount++;
    }
    console.log(
      `✅ ${studentCount}/${demoData.students.length} students created\n`
    );

    // Seed institutions
    console.log("🏫 Seeding institutions...");
    let instCount = 0;
    for (const institution of demoData.institutions) {
      if (await createOrUpdateUser(institution)) instCount++;
    }
    console.log(
      `✅ ${instCount}/${demoData.institutions.length} institutions created\n`
    );

    // Seed companies
    console.log("🏢 Seeding companies...");
    let compCount = 0;
    for (const company of demoData.companies) {
      if (await createOrUpdateUser(company)) compCount++;
    }
    console.log(
      `✅ ${compCount}/${demoData.companies.length} companies created\n`
    );

    // Seed courses
    console.log("📚 Seeding courses...");
    const coursesRef = db.collection("courses");
    const courseIds = [];
    const algoliaCoursesRecords = [];
    for (const course of demoData.courses) {
      const docRef = await coursesRef.add(course);
      courseIds.push(docRef.id);
      // Prepare Algolia record
      if (coursesIndex) {
        algoliaCoursesRecords.push({
          objectID: docRef.id,
          ...course,
          // Convert dates to timestamps for Algolia
          startDate: course.startDate ? course.startDate.getTime() : null,
          applicationDeadline: course.applicationDeadline ? course.applicationDeadline.getTime() : null,
          createdAt: course.createdAt ? course.createdAt.getTime() : Date.now(),
          updatedAt: course.updatedAt ? course.updatedAt.getTime() : Date.now(),
        });
      }
    }
    console.log(
      `✅ ${demoData.courses.length}/${demoData.courses.length} courses created\n`
    );

    // Seed jobs
    console.log("💼 Seeding jobs...");
    const jobsRef = db.collection("jobs");
    const jobIds = [];
    const algoliaJobsRecords = [];
    for (const job of demoData.jobs) {
      const docRef = await jobsRef.add(job);
      jobIds.push(docRef.id);
      // Prepare Algolia record
      if (jobsIndex) {
        algoliaJobsRecords.push({
          objectID: docRef.id,
          ...job,
          // Convert dates to timestamps for Algolia
          applicationDeadline: job.applicationDeadline ? job.applicationDeadline.getTime() : null,
          createdAt: job.createdAt ? job.createdAt.getTime() : Date.now(),
          updatedAt: job.updatedAt ? job.updatedAt.getTime() : Date.now(),
        });
      }
    }
    console.log(
      `✅ ${demoData.jobs.length}/${demoData.jobs.length} jobs created\n`
    );

    // Sync to Algolia
    if (algoliaClient) {
      console.log("🔍 Syncing to Algolia search...");
      try {
        if (algoliaCoursesRecords.length > 0) {
          await coursesIndex.saveObjects(algoliaCoursesRecords);
          console.log(`   ✅ ${algoliaCoursesRecords.length} courses synced to Algolia`);
        }
        if (algoliaJobsRecords.length > 0) {
          await jobsIndex.saveObjects(algoliaJobsRecords);
          console.log(`   ✅ ${algoliaJobsRecords.length} jobs synced to Algolia`);
        }
        
        // Configure Algolia indices
        await coursesIndex.setSettings({
          searchableAttributes: ['name', 'description', 'institutionName', 'field', 'level', 'location'],
          attributesForFaceting: ['field', 'level', 'location', 'status', 'institutionName'],
          ranking: ['desc(createdAt)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        });
        
        await jobsIndex.setSettings({
          searchableAttributes: ['title', 'description', 'companyName', 'type', 'location', 'skills'],
          attributesForFaceting: ['type', 'location', 'experienceLevel', 'status', 'companyName'],
          ranking: ['desc(createdAt)', 'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
        });
        
        console.log("   ✅ Algolia index settings configured\n");
      } catch (algoliaError) {
        console.error("   ⚠️ Algolia sync failed:", algoliaError.message);
      }
    }

    // Seed applications
    console.log("📋 Seeding applications...");
    const applicationsRef = db.collection("applications");
    for (const application of demoData.applications) {
      await applicationsRef.add(application);
    }
    console.log(
      `✅ ${demoData.applications.length}/${demoData.applications.length} applications created\n`
    );

    // Seed admissions
    console.log("✅ Seeding admissions...");
    const admissionsRef = db.collection("admissions");
    for (const admission of demoData.admissions) {
      await admissionsRef.add(admission);
    }
    console.log(
      `✅ ${demoData.admissions.length}/${demoData.admissions.length} admissions created\n`
    );

    console.log("=====================================");
    console.log("✅ Database seeding completed successfully!\n");

    // Print credentials
    console.log("📝 Demo Account Credentials:");
    console.log("=====================================\n");

    console.log("🔐 ADMIN ACCOUNT:");
    console.log(`   Email: ${demoData.adminUser.email}`);
    console.log(`   Password: ${demoData.adminUser.password}\n`);

    console.log("👨‍🎓 STUDENT ACCOUNTS:");
    for (const student of demoData.students) {
      console.log(`   Email: ${student.email}`);
      console.log(`   Password: ${student.password}`);
      console.log(`   Name: ${student.displayName}\n`);
    }

    console.log("🏫 INSTITUTION ACCOUNTS:");
    for (const inst of demoData.institutions) {
      console.log(`   Email: ${inst.email}`);
      console.log(`   Password: ${inst.password}`);
      console.log(`   Name: ${inst.institutionName}\n`);
    }

    console.log("🏢 COMPANY ACCOUNTS:");
    for (const company of demoData.companies) {
      console.log(`   Email: ${company.email}`);
      console.log(`   Password: ${company.password}`);
      console.log(`   Name: ${company.companyName}\n`);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed
seedDatabase();
