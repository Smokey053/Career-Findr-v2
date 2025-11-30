# Database Seeding Script

## Overview

This script populates the Firebase Firestore database with comprehensive demo data for testing and presentation purposes.

## Demo Data Included

### 1. Admin Account

- **Email:** admin@careerfindr.com
- **Password:** admin123
- **Role:** Admin with full system privileges

### 2. Student Accounts (3)

- John Doe - Skills: JavaScript, React, Node.js
- Jane Smith - Skills: Python, Data Analysis, SQL
- Peter Wilson - Skills: Java, Android, Firebase

### 3. Institutions (2)

- National University of Lesotho (Maseru)
- Lesotho Technical Institute of Education (Leribe)

### 4. Companies (2)

- Tech Corporation Lesotho (Technology)
- Finance Pro Services (Finance)

### 5. Courses (4)

- Bachelor of Science in Computer Science (NUL)
- Master of Business Administration (NUL)
- Diploma in Electrical Engineering (LETIE)
- Bachelor of Science in Nursing (NUL)

### 6. Job Listings (4)

- Senior Full Stack Developer (Tech Corp)
- Junior Software Developer (Tech Corp)
- Financial Analyst (Finance Pro)
- Accounting Clerk (Finance Pro)

### 7. Applications & Admissions

- Various course and job applications in different statuses
- Admission records for approved applications

## Prerequisites

- Node.js installed
- Firebase Admin SDK
- serviceAccountKey.json in the root directory
- Firebase project configured in `.env` or environment variables

## Installation

```bash
# Install required dependencies (if not already installed)
npm install firebase-admin
```

## Usage

### Method 1: Direct Execution

```bash
node scripts/seedDatabase.js
```

### Method 2: Using npm script (add to package.json)

```json
{
  "scripts": {
    "seed": "node scripts/seedDatabase.js"
  }
}
```

Then run:

```bash
npm run seed
```

## What Gets Created

The script will:

1. Create admin user account
2. Create 3 student accounts with profiles
3. Create 2 institution accounts
4. Create 2 company accounts
5. Create 4 courses with details
6. Create 4 job listings
7. Create course and job applications
8. Create admission records

## Output

After successful execution, you'll see:

- Confirmation of each data type created
- List of all demo account credentials
- Total counts of created records

## Important Notes

⚠️ **Warning:** This script will:

- Create new users in Firebase Authentication
- Create documents in Firestore
- Skip users that already exist to prevent duplicates

### Development Environment

If using the Firebase Emulator, ensure it's running before executing the script.

### Admin Privileges

The admin account created by this script has full access to:

- All user records
- All courses and job listings
- All applications and admissions
- User management capabilities

## Troubleshooting

### Error: "Firebase configuration is missing"

- Ensure `serviceAccountKey.json` exists in the root directory

### Error: "uid-already-exists"

- The user already exists in Firebase Auth
- Script will skip and continue with others

### Error: "Permission denied"

- Verify Firestore rules allow the operations
- Check that the service account has proper permissions

## Testing After Seeding

1. **Login as Admin:**

   - Email: admin@careerfindr.com
   - Password: admin123
   - Access: Full admin dashboard

2. **Login as Student:**

   - Use any student email listed in output
   - Access: Course search, job board, applications

3. **Login as Institution:**

   - Use any institution email listed in output
   - Access: Course management, applications review

4. **Login as Company:**
   - Use any company email listed in output
   - Access: Job management, applicant review

## Cleanup

To delete all seeded data:

```bash
# Delete all users from Auth (requires Firebase CLI)
firebase auth:delete --email admin@careerfindr.com
firebase auth:delete --email john.doe@student.com
# etc...

# Delete collections from Firestore (requires Firebase CLI or console)
firebase firestore:delete --recursive --yes users
firebase firestore:delete --recursive --yes courses
firebase firestore:delete --recursive --yes jobs
firebase firestore:delete --recursive --yes applications
firebase firestore:delete --recursive --yes admissions
```

## Database Structure

```
users/
├── admin-user-001 (Admin)
├── student-001 (Student)
├── student-002 (Student)
├── student-003 (Student)
├── institution-001 (Institution)
├── institution-002 (Institution)
├── company-001 (Company)
└── company-002 (Company)

courses/
├── Course 1 (by institution-001)
├── Course 2 (by institution-001)
├── Course 3 (by institution-002)
└── Course 4 (by institution-001)

jobs/
├── Job 1 (by company-001)
├── Job 2 (by company-001)
├── Job 3 (by company-002)
└── Job 4 (by company-002)

applications/
├── Application 1 (course)
├── Application 2 (course)
├── Application 3 (job)
└── Application 4 (job)

admissions/
└── Admission 1 (for approved application)
```

## Support

For issues or questions about the seeding script, refer to the main project documentation.
