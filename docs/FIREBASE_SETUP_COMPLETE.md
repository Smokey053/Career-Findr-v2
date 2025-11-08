# 🔥 Firebase Setup Guide - Career Findr

Complete guide for setting up and configuring Firebase for the Career Findr platform.

---

## 📋 Table of Contents

1. [Firebase Project Setup](#firebase-project-setup)
2. [Authentication Configuration](#authentication-configuration)
3. [Firestore Database Setup](#firestore-database-setup)
4. [Firebase Storage Configuration](#firebase-storage-configuration)
5. [Security Rules](#security-rules)
6. [Environment Variables](#environment-variables)
7. [Testing & Verification](#testing--verification)

---

## 🚀 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: **career-findr**
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Register Web App

1. Click the web icon (</>) in project overview
2. Register app with nickname: **career-findr-web**
3. Copy the Firebase configuration object
4. Click "Continue to console"

### Your Current Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBZidAMJf1B2Qh3-GI1bfPBg84E_iyQNGk",
  authDomain: "career-findr.firebaseapp.com",
  databaseURL: "https://career-findr-default-rtdb.firebaseio.com",
  projectId: "career-findr",
  storageBucket: "career-findr.firebasestorage.app",
  messagingSenderId: "1015446452587",
  appId: "1:1015446452587:web:bea0fc936ac4eccf53342e",
  measurementId: "G-L9P1818ZKS",
};
```

---

## 🔐 Authentication Configuration

### Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:

#### Email/Password

- Click **Email/Password**
- Toggle **Enable**
- Click **Save**

#### Google Sign-In (Optional)

- Click **Google**
- Toggle **Enable**
- Add support email
- Click **Save**

### Configure Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `career-findr.firebaseapp.com`
   - `career-findr.web.app`
   - Your custom domain (if any)

---

## 🗄️ Firestore Database Setup

### Step 1: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules later)
4. Select location (closest to your users): **us-central1**
5. Click **Enable**

### Step 2: Create Collections

Create the following root collections:

#### 1. `users`

```javascript
// Document structure
{
  uid: string,
  email: string,
  role: 'student' | 'institute' | 'company' | 'admin',
  profile: {
    name: string,
    phone: string,
    avatar: string,
    // Role-specific fields
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `notifications`

```javascript
{
  userId: string,
  title: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'application' | 'job' | 'message' | 'interview' | 'user' | 'course',
  read: boolean,
  link: string (optional),
  createdAt: timestamp
}
```

#### 3. `events`

```javascript
{
  title: string,
  description: string,
  type: 'interview' | 'meeting' | 'deadline' | 'other',
  location: string,
  meetingLink: string,
  startTime: timestamp,
  endTime: timestamp,
  participantIds: array<string>,
  participantNames: array<string>,
  jobId: string (optional),
  jobTitle: string (optional),
  createdBy: string,
  createdAt: timestamp,
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
}
```

#### 4. `chats`

```javascript
{
  participants: array<string>,
  participantsData: map,
  lastMessage: string,
  lastMessageTime: timestamp,
  unreadCount: number,
  online: boolean
}

// Subcollection: messages
{
  text: string,
  senderId: string,
  senderName: string,
  timestamp: timestamp,
  read: boolean,
  attachments: array (optional)
}
```

#### 5. `jobs`

```javascript
{
  companyId: string,
  title: string,
  description: string,
  requirements: array<string>,
  location: string,
  type: 'full-time' | 'part-time' | 'internship' | 'contract',
  salary: {
    min: number,
    max: number,
    currency: string
  },
  status: 'active' | 'closed' | 'draft',
  applicants: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 6. `courses`

```javascript
{
  instituteId: string,
  name: string,
  description: string,
  duration: string,
  fees: number,
  requirements: array<string>,
  seats: number,
  availableSeats: number,
  startDate: timestamp,
  status: 'active' | 'closed' | 'draft',
  applications: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 7. `applications` (Student Applications)

```javascript
{
  studentId: string,
  courseId: string,
  instituteId: string,
  status: 'pending' | 'under-review' | 'shortlisted' | 'accepted' | 'rejected',
  documents: array,
  submittedAt: timestamp,
  updatedAt: timestamp
}
```

#### 8. `job_applications`

```javascript
{
  studentId: string,
  jobId: string,
  companyId: string,
  status: 'applied' | 'shortlisted' | 'interviewing' | 'offered' | 'accepted' | 'rejected',
  resume: string,
  coverLetter: string,
  matchScore: number,
  appliedAt: timestamp,
  updatedAt: timestamp
}
```

### Step 3: Create Indexes

Create composite indexes for efficient queries:

1. Go to **Firestore Database** → **Indexes** → **Composite**
2. Create the following indexes:

```
Collection: notifications
Fields: userId (Ascending), createdAt (Descending)

Collection: notifications
Fields: userId (Ascending), read (Ascending), createdAt (Descending)

Collection: events
Fields: participantIds (Array), startTime (Ascending)

Collection: events
Fields: participantIds (Array), status (Ascending), startTime (Ascending)

Collection: chats
Fields: participants (Array), lastMessageTime (Descending)

Collection: jobs
Fields: status (Ascending), createdAt (Descending)

Collection: courses
Fields: status (Ascending), startDate (Ascending)

Collection: applications
Fields: studentId (Ascending), status (Ascending), submittedAt (Descending)

Collection: applications
Fields: instituteId (Ascending), status (Ascending), submittedAt (Descending)

Collection: job_applications
Fields: studentId (Ascending), status (Ascending), appliedAt (Descending)

Collection: job_applications
Fields: companyId (Ascending), status (Ascending), appliedAt (Descending)
```

---

## 📦 Firebase Storage Configuration

### Step 1: Initialize Storage

1. Go to **Storage** in Firebase Console
2. Click **Get Started**
3. Start in **production mode**
4. Choose location (same as Firestore): **us-central1**
5. Click **Done**

### Step 2: Create Storage Buckets

Create the following folder structure:

```
career-findr.appspot.com/
├── resumes/
│   └── {userId}/
│       └── {timestamp}_{filename}
├── profile-images/
│   └── {userId}/
│       └── {timestamp}_{filename}
├── course-materials/
│   └── {courseId}/
│       └── {userId}/
│           └── {timestamp}_{filename}
├── company-logos/
│   └── {companyId}/
│       └── {timestamp}_{filename}
├── institute-logos/
│   └── {instituteId}/
│       └── {timestamp}_{filename}
├── job-attachments/
│   └── {jobId}/
│       └── {timestamp}_{filename}
├── chat-attachments/
│   └── {chatId}/
│       └── {userId}/
│           └── {timestamp}_{filename}
└── documents/
    └── {userId}/
        └── {timestamp}_{filename}
```

### Storage Service Integration

The storage service (`src/services/storageService.js`) is already configured with:

- File upload with progress tracking
- Multiple file uploads
- File deletion
- File metadata retrieval
- Specialized upload functions (resume, profile image, logo, etc.)
- File size validation
- File type validation

**Usage Example:**

```javascript
import { uploadResume, uploadProfileImage } from "./services/storageService";

// Upload resume
const result = await uploadResume(file, userId, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});

// Upload profile image
const imageResult = await uploadProfileImage(imageFile, userId);
```

---

## 🔒 Security Rules

### Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function hasRole(role) {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    // Users Collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isOwner(userId) || hasRole('admin');
      allow delete: if hasRole('admin');
    }

    // Notifications Collection
    match /notifications/{notificationId} {
      allow read, update: if isSignedIn() && isOwner(resource.data.userId);
      allow create: if isSignedIn();
      allow delete: if hasRole('admin') || isOwner(resource.data.userId);
    }

    // Events Collection
    match /events/{eventId} {
      allow read: if isSignedIn() && request.auth.uid in resource.data.participantIds;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && request.auth.uid == resource.data.createdBy;
    }

    // Chats Collection
    match /chats/{chatId} {
      allow read, write: if isSignedIn() && request.auth.uid in resource.data.participants;

      // Messages Subcollection
      match /messages/{messageId} {
        allow read, write: if isSignedIn();
      }
    }

    // Jobs Collection
    match /jobs/{jobId} {
      allow read: if isSignedIn();
      allow create: if hasRole('company');
      allow update, delete: if hasRole('company') && isOwner(resource.data.companyId);
    }

    // Courses Collection
    match /courses/{courseId} {
      allow read: if isSignedIn();
      allow create: if hasRole('institute');
      allow update, delete: if hasRole('institute') && isOwner(resource.data.instituteId);
    }

    // Applications Collection
    match /applications/{applicationId} {
      allow read: if isSignedIn() &&
                    (isOwner(resource.data.studentId) ||
                     isOwner(resource.data.instituteId) ||
                     hasRole('admin'));
      allow create: if hasRole('student') && isOwner(request.resource.data.studentId);
      allow update: if hasRole('institute') && isOwner(resource.data.instituteId);
      allow delete: if hasRole('admin') || isOwner(resource.data.studentId);
    }

    // Job Applications Collection
    match /job_applications/{applicationId} {
      allow read: if isSignedIn() &&
                    (isOwner(resource.data.studentId) ||
                     isOwner(resource.data.companyId) ||
                     hasRole('admin'));
      allow create: if hasRole('student') && isOwner(request.resource.data.studentId);
      allow update: if hasRole('company') && isOwner(resource.data.companyId);
      allow delete: if hasRole('admin') || isOwner(resource.data.studentId);
    }

    // Admin-only collections
    match /admin_logs/{logId} {
      allow read, write: if hasRole('admin');
    }

    // Platform stats (read-only for users, write for admin)
    match /stats/{statId} {
      allow read: if isSignedIn();
      allow write: if hasRole('admin');
    }
  }
}
```

### Firebase Storage Security Rules

Go to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function hasRole(role) {
      return request.auth.token.role == role;
    }

    // Valid file size (max 25MB)
    function validSize() {
      return request.resource.size < 25 * 1024 * 1024;
    }

    // Valid image file
    function validImage() {
      return request.resource.contentType.matches('image/.*');
    }

    // Valid document
    function validDocument() {
      return request.resource.contentType.matches('application/pdf') ||
             request.resource.contentType.matches('application/msword') ||
             request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.*');
    }

    // Resumes - Only file owner can read/write
    match /resumes/{userId}/{fileName} {
      allow read: if isSignedIn() && (isOwner(userId) || hasRole('company') || hasRole('institute') || hasRole('admin'));
      allow write: if isSignedIn() && isOwner(userId) && validDocument() && validSize();
      allow delete: if isSignedIn() && (isOwner(userId) || hasRole('admin'));
    }

    // Profile Images - Anyone can read, only owner can write
    match /profile-images/{userId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isOwner(userId) && validImage() && request.resource.size < 5 * 1024 * 1024;
      allow delete: if isSignedIn() && (isOwner(userId) || hasRole('admin'));
    }

    // Course Materials
    match /course-materials/{courseId}/{userId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && (isOwner(userId) || hasRole('institute')) && validSize();
      allow delete: if isSignedIn() && (isOwner(userId) || hasRole('institute') || hasRole('admin'));
    }

    // Company Logos
    match /company-logos/{companyId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && hasRole('company') && validImage() && request.resource.size < 2 * 1024 * 1024;
      allow delete: if hasRole('company') || hasRole('admin');
    }

    // Institute Logos
    match /institute-logos/{instituteId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && hasRole('institute') && validImage() && request.resource.size < 2 * 1024 * 1024;
      allow delete: if hasRole('institute') || hasRole('admin');
    }

    // Job Attachments
    match /job-attachments/{jobId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && hasRole('company') && validSize();
      allow delete: if hasRole('company') || hasRole('admin');
    }

    // Chat Attachments
    match /chat-attachments/{chatId}/{userId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isOwner(userId) && validSize();
      allow delete: if isSignedIn() && isOwner(userId);
    }

    // Documents
    match /documents/{userId}/{fileName} {
      allow read, write: if isSignedIn() && (isOwner(userId) || hasRole('admin')) && validSize();
      allow delete: if isSignedIn() && (isOwner(userId) || hasRole('admin'));
    }
  }
}
```

---

## 🌐 Environment Variables

### Create `.env` file in `client/career-findr/`

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBZidAMJf1B2Qh3-GI1bfPBg84E_iyQNGk
VITE_FIREBASE_AUTH_DOMAIN=career-findr.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://career-findr-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=career-findr
VITE_FIREBASE_STORAGE_BUCKET=career-findr.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1015446452587
VITE_FIREBASE_APP_ID=1:1015446452587:web:bea0fc936ac4eccf53342e
VITE_FIREBASE_MEASUREMENT_ID=G-L9P1818ZKS

# Firebase Emulator (Development Only)
VITE_USE_EMULATOR=false

# API Configuration
VITE_API_URL=http://localhost:5000
```

### Update `firebase.js` to use environment variables (Optional):

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

---

## ✅ Testing & Verification

### 1. Test Authentication

```javascript
// Create test user
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebase";

const testAuth = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "test@example.com",
      "password123"
    );
    console.log("✅ Auth working:", userCredential.user.uid);
  } catch (error) {
    console.error("❌ Auth error:", error);
  }
};
```

### 2. Test Firestore

```javascript
// Write test document
import { collection, addDoc } from "firebase/firestore";
import { db } from "./config/firebase";

const testFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Hello Firestore!",
      timestamp: new Date(),
    });
    console.log("✅ Firestore working:", docRef.id);
  } catch (error) {
    console.error("❌ Firestore error:", error);
  }
};
```

### 3. Test Storage

```javascript
// Upload test file
import { uploadFile, STORAGE_PATHS } from "./services/storageService";

const testStorage = async (file, userId) => {
  try {
    const result = await uploadFile(file, STORAGE_PATHS.DOCUMENTS, userId);
    console.log("✅ Storage working:", result.url);
  } catch (error) {
    console.error("❌ Storage error:", error);
  }
};
```

### 4. Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered
- [ ] Authentication enabled (Email/Password)
- [ ] Authorized domains configured
- [ ] Firestore database created
- [ ] All collections created
- [ ] Indexes created
- [ ] Storage initialized
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Environment variables configured
- [ ] Test authentication successful
- [ ] Test Firestore read/write successful
- [ ] Test Storage upload successful

---

## 🚨 Common Issues & Solutions

### Issue: "Missing or insufficient permissions"

**Solution**: Check Firestore security rules and ensure user is authenticated

### Issue: "Storage upload fails"

**Solution**: Verify Storage security rules and file size limits

### Issue: "Index required" error

**Solution**: Click the provided link to create the required index automatically

### Issue: "CORS error" when uploading files

**Solution**: Configure CORS for your storage bucket:

```bash
gsutil cors set cors.json gs://career-findr.firebasestorage.app
```

`cors.json`:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 📞 Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Storage Documentation](https://firebase.google.com/docs/storage)
- [Security Rules Reference](https://firebase.google.com/docs/rules)

---

## 🎉 Setup Complete!

Your Firebase configuration is now ready for production. All services are properly configured with:

✅ Authentication
✅ Firestore Database with collections and indexes
✅ Firebase Storage with organized structure
✅ Security rules for both Firestore and Storage
✅ Storage service for file management
✅ Environment variables

**Next Steps:**

1. Test all features thoroughly
2. Monitor Firebase usage in console
3. Set up billing alerts
4. Configure backup schedule (if needed)
5. Deploy to production

---

**Last Updated**: December 2024
**Firebase SDK Version**: 10.x
**Status**: ✅ Production Ready
