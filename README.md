# 🎓 Career Findr# 🎓 Career Findr - Complete Career Management Platform

> Multi-role career management platform connecting students, educational institutions, and companies for seamless course enrollment and job placement.> A comprehensive platform connecting Students, Educational Institutes, and Companies for career opportunities and course enrollments.

![Status](https://img.shields.io/badge/status-production%20ready-success) ![Version](https://img.shields.io/badge/version-2.0.0-blue) ![Firebase](https://img.shields.io/badge/firebase-enabled-orange) ![React](https://img.shields.io/badge/react-19.1.1-blue)![Status](https://img.shields.io/badge/status-production%20ready-success)

![Version](https://img.shields.io/badge/version-2.0.0-blue)

---![Firebase](https://img.shields.io/badge/firebase-10.x-orange)

![React](https://img.shields.io/badge/react-19.1.1-blue)

## ✨ Features

---

**Core Capabilities:**

- 🔐 Multi-role authentication (Student, Institution, Company, Admin)## 📋 Table of Contents

- 📚 Course browsing and enrollment management

- 💼 Job listings with application tracking- [Features](#-features)

- 🔔 Real-time notifications- [Tech Stack](#-tech-stack)

- 💬 Messaging system- [Quick Start](#-quick-start)

- 📅 Calendar integration with interview scheduling- [Project Structure](#-project-structure)

- 📁 File management (resumes, documents, images)- [Firebase Setup](#-firebase-setup)

- 📊 Export to CSV, Excel, PDF, JSON- [Documentation](#-documentation)

- 📱 Fully responsive design- [User Roles](#-user-roles)

- [API Integration](#-api-integration)

**User Roles:**- [Deployment](#-deployment)

- **Students**: Browse courses/jobs, apply, track applications, schedule interviews- [Contributing](#-contributing)

- **Institutions**: Manage courses, review applications, communicate with students

- **Companies**: Post jobs, review candidates, schedule interviews, export data---

- **Admins**: User management, platform stats, role impersonation, system oversight

## ✨ Features

---

### Core Features

## 🛠️ Tech Stack

- ✅ **Multi-Role Authentication** - Students, Institutes, Companies, Admins

**Frontend:** React 19.1.1, Vite 7, Material-UI 7, React Router DOM 7, React Query 5 - ✅ **Course Management** - Browse, search, and apply to courses

**Backend:** Firebase (Auth, Firestore, Storage) - ✅ **Job Board** - Job listings with AI-powered matching

**Forms:** React Hook Form 7, Yup validation - ✅ **Application Tracking** - Complete application lifecycle management

**Additional:** react-big-calendar, recharts, jspdf, xlsx, react-pdf- ✅ **User Dashboards** - Role-specific dashboards with analytics

---### Advanced Features (Recently Added)

## 🚀 Quick Start- 🔔 **Real-time Notifications** - Instant updates with Firestore sync

- 📅 **Calendar Integration** - Interview scheduling with Google Calendar export

### Prerequisites- 💬 **Messaging System** - Real-time chat between users

- Node.js 18+- 🔖 **Saved Items** - Bookmark jobs and courses

- Firebase account- 📄 **File Preview** - In-browser PDF, image, and video viewer

- Git- 📊 **Export & Reports** - Export data to CSV, Excel, PDF, JSON

- 👤 **Role Impersonation** - Admin support feature

### Installation- 📁 **Firebase Storage** - Comprehensive file management

````bash### UI/UX Enhancements

# Clone repository

git clone https://github.com/Smokey053/Career-Findr.git- 🎨 Modern, professional design with Material-UI

cd Career-Findr- 📱 Fully responsive (mobile, tablet, desktop)

- ⚡ Fast loading with optimized queries

# Install client dependencies- 🎯 Intuitive navigation and user flows

cd client/career-findr- ♿ Accessibility considerations

npm install

---

# Configure environment

# Create .env file with your Firebase credentials## 🛠️ Tech Stack

VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain### Frontend

VITE_FIREBASE_PROJECT_ID=career-findr

VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket- **Framework**: React 19.1.1

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id- **Build Tool**: Vite 7.1.12

VITE_FIREBASE_APP_ID=your_app_id- **UI Library**: Material-UI 7.3.5

VITE_USE_EMULATOR=false- **CSS Framework**: Bootstrap 5.3.3

- **State Management**: React Query 5.90.6, Context API

# Start development server- **Forms**: React Hook Form 7.66.0, Yup 1.7.1

npm run dev- **Router**: React Router DOM 7.2.0

# App runs at http://localhost:5173

```### Backend & Services



### Demo Credentials- **Database**: Firebase Firestore

**Admin Account:**- **Authentication**: Firebase Auth

- Email: `admin@careerfindr.com`- **Storage**: Firebase Storage

- Password: `admin123`- **Real-time**: Firestore onSnapshot listeners



---### Additional Libraries



## 🔥 Firebase Setup- **Calendar**: react-big-calendar, moment

- **Charts**: recharts

### 1. Create Firebase Project- **File Handling**: react-pdf, xlsx

1. Go to [Firebase Console](https://console.firebase.google.com/)- **PDF Generation**: jspdf, jspdf-autotable

2. Create project: **career-findr**- **Date Formatting**: date-fns

3. Register web app

---

### 2. Enable Services

- **Authentication**: Email/Password provider## 🚀 Quick Start

- **Firestore**: Create database (production mode)

- **Storage**: Initialize bucket### Prerequisites



### 3. Deploy Security Rules- Node.js 18+ and npm

```bash- Firebase account

# Deploy Firestore and Storage rules- Git

firebase deploy --only firestore:rules,storage:rules

```### Demo Admin Credentials



### 4. Required CollectionsFor testing admin features:

- `users` - User profiles

- `notifications` - User notifications- **Email**: `admin@careerfindr.com`

- `events` - Calendar events- **Password**: `admin123`

- `chats` - Messages (with `messages` subcollection)

- `jobs` - Job postings**⚠️ Note**: See `/docs/ADMIN_SETUP.md` for instructions on creating admin accounts in your Firebase project.

- `courses` - Course listings

- `applications` - Course applications### Installation

- `job_applications` - Job applications

1. **Clone the repository**

**📖 Complete setup guide:** See `DEPLOYMENT_CHECKLIST.md`

```bash

---git clone https://github.com/Smokey053/Career-Findr.git

cd Career-Findr

## 🚀 Deployment```



### Quick Deploy (Using Script)2. **Install client dependencies**

```powershell

# Run pre-deployment tests```bash

.\pre-deployment-test.ps1cd client/career-findr

npm install

# Deploy to Firebase Hosting```

.\firebase-setup.ps1

# Choose option 6: Build and Deploy Everything3. **Configure environment variables**

````

Create `.env` in `client/career-findr/`:

### Manual Deployment

`bash`env

# Build for productionVITE_FIREBASE_API_KEY=your_api_key

cd client/career-findrVITE_FIREBASE_AUTH_DOMAIN=your_domain

npm run buildVITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_bucket

# Deploy to FirebaseVITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

cd ../..VITE_FIREBASE_APP_ID=your_app_id

firebase deploy --only hostingVITE_USE_EMULATOR=false

```````



**Live URL:** `https://career-findr.web.app`4. **Start development server**



---```bash

npm run dev

## 📁 Project Structure```



```The app will be available at `http://localhost:5173`

Career-Findr/

├── client/career-findr/          # React frontend### Backend Setup (Optional)

│   ├── src/

│   │   ├── components/           # Reusable components```bash

│   │   │   ├── common/           # Navbar, FileUploader, Calendar, etc.cd backend

│   │   │   └── ProtectedRoute.jsxnpm install

│   │   ├── contexts/             # AuthContext, NotificationContext, etc.npm run dev

│   │   ├── pages/                # All page components```

│   │   │   ├── student/          # Student portal

│   │   │   ├── institute/        # Institution portalBackend runs at `http://localhost:5000`

│   │   │   ├── company/          # Company portal

│   │   │   ├── admin/            # Admin portal---

│   │   │   └── common/           # Messages, Calendar, Notifications

│   │   ├── services/             # API & storage services## 📁 Project Structure

│   │   ├── config/               # Firebase config

│   │   └── theme/                # MUI theme```

│   └── package.jsonCareer-Findr/

├── server/                       # Optional Express backend├── client/career-findr/          # React frontend

├── docs/                         # Additional documentation│   ├── src/

├── firebase.json                 # Firebase configuration│   │   ├── components/           # Reusable components

├── firestore.rules               # Database security rules│   │   │   ├── common/           # Common components (Navbar, FileUploader, etc.)

├── storage.rules                 # Storage security rules│   │   │   └── ProtectedRoute.jsx

├── firebase-setup.ps1            # Deployment script│   │   ├── contexts/             # React contexts

├── pre-deployment-test.ps1       # Pre-deployment tests│   │   │   ├── AuthContext.jsx

└── DEPLOYMENT_CHECKLIST.md       # Deployment guide│   │   │   ├── NotificationContext.jsx

```│   │   │   └── ImpersonationContext.jsx

│   │   ├── pages/                # Page components

---│   │   │   ├── student/          # Student pages

│   │   │   ├── institute/        # Institute pages

## 📚 Documentation│   │   │   ├── company/          # Company pages

│   │   │   ├── admin/            # Admin pages

| Document | Description |│   │   │   └── common/           # Common pages (Messages, Calendar, etc.)

|----------|-------------|│   │   ├── services/             # API services

| `DEPLOYMENT_CHECKLIST.md` | Complete deployment guide with testing checklist |│   │   │   ├── api.js

| `docs/FIREBASE_SETUP_COMPLETE.md` | Detailed Firebase configuration |│   │   │   └── storageService.js

| `client/career-findr/COMPONENT_API.md` | Component usage reference |│   │   ├── config/               # Configuration

| `client/career-findr/TESTING_CHECKLIST.md` | 159 test cases |│   │   │   └── firebase.js

│   │   ├── theme/                # MUI theme

---│   │   ├── App.jsx               # Main app component

│   │   └── main.jsx              # Entry point

## 🔐 Security Features│   ├── public/                   # Static assets

│   ├── package.json

- ✅ Firebase Authentication with role-based access control│   └── vite.config.js

- ✅ Firestore security rules (user-specific data access)├── backend/                      # Express.js backend (optional)

- ✅ Storage security rules (file type & size validation)│   ├── controllers/

- ✅ Protected routes with role verification│   ├── routes/

- ✅ File upload restrictions (10MB resumes, 5MB images)│   ├── middleware/

- ✅ Admin credentials removed from production builds│   ├── config/

│   └── server.js

---└── docs/                         # Documentation

    ├── FIREBASE_SETUP_COMPLETE.md

## 📊 Project Statistics    ├── FEATURES_IMPLEMENTATION.md

    ├── COMPONENT_API.md

- **25+ Pages** - Full-featured portals for all roles    └── TESTING_CHECKLIST.md

- **15+ Components** - Reusable, production-ready```

- **8 Advanced Features** - Real-time updates, calendar, messaging, file management

- **8 Storage Paths** - Organized file structure---

- **159 Test Cases** - Comprehensive coverage

- **4,000+ Lines** - Clean, maintainable code## 🔥 Firebase Setup



---### Quick Setup



## 🎯 Key Features by Role1. **Create Firebase Project**



### Students   - Go to [Firebase Console](https://console.firebase.google.com/)

- Browse & search courses/jobs   - Create project: **career-findr**

- Submit applications with resume upload   - Register web app

- Track application status in real-time

- Bookmark favorite items2. **Enable Services**

- Schedule interviews

- Chat with institutions/companies   - **Authentication**: Enable Email/Password

- Receive instant notifications   - **Firestore**: Create database in production mode

   - **Storage**: Initialize storage bucket

### Institutions

- Create & manage courses3. **Deploy Security Rules**

- Review student applications

- Accept/reject applicants   See `FIREBASE_SETUP_COMPLETE.md` for complete Firestore and Storage security rules.

- Upload course materials

- View analytics dashboard4. **Create Collections**

- Communicate with students   - users

   - notifications

### Companies   - events

- Post & manage job listings   - chats (with messages subcollection)

- Review applications   - jobs

- AI-powered candidate matching   - courses

- Schedule interviews   - applications

- Search candidate database   - job_applications

- Export applicant data (CSV, Excel, PDF)

- Real-time messaging**📖 Complete Firebase setup guide**: See `/FIREBASE_SETUP_COMPLETE.md`



### Admins---

- Manage all users & roles

- View platform statistics## 📚 Documentation

- Role impersonation for support

- Export system reportsComprehensive documentation is available in the following files:

- Monitor platform activity

- Configure system settings| Document                                                                       | Description                             |

| ------------------------------------------------------------------------------ | --------------------------------------- |

---| [FIREBASE_SETUP_COMPLETE.md](./FIREBASE_SETUP_COMPLETE.md)                     | Complete Firebase configuration guide   |

| [FEATURES_IMPLEMENTATION.md](./client/career-findr/FEATURES_IMPLEMENTATION.md) | Detailed feature documentation          |

## 🔄 Deployment Scripts| [COMPONENT_API.md](./client/career-findr/COMPONENT_API.md)                     | Component usage reference               |

| [TESTING_CHECKLIST.md](./client/career-findr/TESTING_CHECKLIST.md)             | Comprehensive testing guide (159 tests) |

### `firebase-setup.ps1`

Interactive deployment script with options:---

1. Deploy Firestore Rules

2. Deploy Storage Rules## 👥 User Roles

3. Deploy All Rules

4. Build & Deploy to Firebase Hosting### 1. Student

5. Start Firebase Emulators

6. Build and Deploy Everything- Browse and search courses

7. Exit- Browse and search jobs

- Apply to courses and jobs

### `pre-deployment-test.ps1`- Track application status

Automated pre-deployment validation:- Bookmark items

- ✓ Firebase CLI installed- Schedule interviews

- ✓ Logged in to Firebase- Chat with institutes/companies

- ✓ Dependencies installed- Receive notifications

- ✓ Environment files exist

- ✓ Configuration files valid### 2. Institute

- ✓ Build successful

- Create and manage courses

---- Review student applications

- Accept/reject applications

## 🌐 Environment Variables- Upload course materials

- Communicate with students

### Development (`.env`)- View analytics

```env

VITE_FIREBASE_API_KEY=your_dev_api_key### 3. Company

VITE_FIREBASE_AUTH_DOMAIN=career-findr.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=career-findr- Post and manage job listings

VITE_FIREBASE_STORAGE_BUCKET=career-findr.firebasestorage.app- Review job applications

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id- AI-powered candidate matching

VITE_FIREBASE_APP_ID=your_app_id- Schedule interviews

VITE_USE_EMULATOR=false- Search candidate database

VITE_API_URL=http://localhost:5000- Export applicant data

```- Communicate with applicants



### Production (`.env.production`)### 4. Admin

```env

VITE_FIREBASE_API_KEY=your_prod_api_key- Manage all users

VITE_FIREBASE_AUTH_DOMAIN=career-findr.firebaseapp.com- View platform statistics

VITE_FIREBASE_PROJECT_ID=career-findr- Role impersonation (support)

VITE_FIREBASE_STORAGE_BUCKET=career-findr.firebasestorage.app- Export data and reports

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id- Monitor platform activity

VITE_FIREBASE_APP_ID=your_app_id- System configuration

VITE_USE_EMULATOR=false

VITE_API_URL=---

```

## 🔌 API Integration

---

### Firebase Services

## 🧪 Testing

```javascript

```bash// Authentication

# Run automated testsimport { auth } from "./config/firebase";

npm testimport { signInWithEmailAndPassword } from "firebase/auth";



# Manual testing// Firestore

# See client/career-findr/TESTING_CHECKLIST.md for 159 test casesimport { db } from "./config/firebase";

```import { collection, getDocs, addDoc } from "firebase/firestore";



**Test Coverage:**// Storage

- Authentication flows (signup, login, logout)import { uploadFile, STORAGE_PATHS } from "./services/storageService";

- Role-based access control```

- CRUD operations (courses, jobs, applications)

- Real-time notifications### Storage Service

- File uploads & downloads

- Export functionality```javascript

- Responsive design// Upload resume

- Security rulesimport { uploadResume } from "./services/storageService";



---const handleResumeUpload = async (file) => {

  const result = await uploadResume(file, userId, (progress) => {

## 🛠️ Development    console.log(`Upload: ${progress}%`);

  });

```bash  console.log("File URL:", result.url);

# Install dependencies};

cd client/career-findr```

npm install

### Real-time Notifications

# Start dev server with hot reload

npm run dev```javascript

import { useNotifications } from "./contexts/NotificationContext";

# Build for production

npm run buildconst { notifications, unreadCount, markAsRead } = useNotifications();

```

# Preview production build

npm run preview**📖 Complete API documentation**: See `/client/career-findr/COMPONENT_API.md`



# Lint code---

npm run lint

```## 🚀 Deployment



---### Deploy to Firebase Hosting



## 🐛 Troubleshooting1. **Install Firebase CLI**



### Build Fails```bash

```bashnpm install -g firebase-tools

cd client/career-findr```

rm -rf node_modules package-lock.json

npm install2. **Login to Firebase**

npm run build

``````bash

firebase login

### Firebase Connection Issues```

1. Verify Firebase services enabled (Auth, Firestore, Storage)

2. Check environment variables in `.env`3. **Initialize Firebase**

3. Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`

4. Verify project ID matches in `.firebaserc````bash

cd client/career-findr

### File Upload Errorsfirebase init

1. Ensure Storage is enabled in Firebase Console```

2. Deploy storage rules: `firebase deploy --only storage:rules`

3. Check file size limits (10MB resumes, 5MB images)Select:

4. Verify file type restrictions in `storage.rules`

- Hosting

---- Existing project: career-findr

- Public directory: dist

## 📞 Support & Contact- Single-page app: Yes

- GitHub actions: Optional

- **Repository**: [GitHub - Career-Findr](https://github.com/Smokey053/Career-Findr)

- **Issues**: [Report a bug](https://github.com/Smokey053/Career-Findr/issues)4. **Build and Deploy**

- **Documentation**: See `/docs` folder

- **Firebase Console**: [career-findr project](https://console.firebase.google.com/project/career-findr)```bash

npm run build

---firebase deploy

```

## 🤝 Contributing

### Environment Variables for Production

Contributions welcome! Please:

1. Fork the repositoryUpdate `.env.production`:

2. Create feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit changes (`git commit -m 'Add AmazingFeature'`)```env

4. Push to branch (`git push origin feature/AmazingFeature`)VITE_FIREBASE_API_KEY=your_production_api_key

5. Open Pull RequestVITE_FIREBASE_PROJECT_ID=career-findr

VITE_USE_EMULATOR=false

Follow ESLint/Prettier configurations and React best practices.```



------



## 📝 License## 🧪 Testing



MIT License - See LICENSE file for details.### Run Tests



---```bash

npm test

## 👨‍💻 Authors```



**Development Team** - Smokey053  ### Manual Testing

**Contributors** - [View all contributors](https://github.com/Smokey053/Career-Findr/graphs/contributors)

Follow the comprehensive testing checklist:

---

- **159 test cases** covering all features

## 🙏 Acknowledgments- Authentication flows

- Real-time updates

- Material-UI for component library- File uploads

- Firebase for backend infrastructure- Export functionality

- React community for excellent resources- Role-based access control

- All contributors and testers

**📖 Complete testing guide**: See `/client/career-findr/TESTING_CHECKLIST.md`

---

---

**Built with ❤️ using React, Material-UI, and Firebase**

## 📊 Statistics

**Status**: ✅ Production Ready | **Version**: 2.0.0 | **Last Updated**: November 2025

- **20+ Pages**: Full CRUD operations for all roles

**Live Demo**: https://career-findr.web.app- **11 New Components**: Reusable, production-ready

- **7 Advanced Features**: Real-time, calendar, messaging, etc.
- **4 Firestore Collections**: + subcollections
- **8 Storage Paths**: Organized file structure
- **3,500+ Lines**: New code added
- **159 Test Cases**: Comprehensive coverage

---

## 🔐 Security

### Authentication

- Firebase Authentication with email/password
- Protected routes with role-based access
- JWT tokens for API requests

### Database Security

- Comprehensive Firestore security rules
- User-specific data access
- Role-based permissions

### File Storage

- Storage security rules
- File type validation
- File size limits
- User-specific storage paths

---

## 🎯 Roadmap

### Phase 1 - Core Features (✅ Complete)

- Multi-role authentication
- Course and job management
- Application tracking
- User dashboards

### Phase 2 - Advanced Features (✅ Complete)

- Real-time notifications
- Calendar integration
- Messaging system
- File management
- Export functionality
- Admin tools

### Phase 3 - Enhancements (🔄 In Progress)

- [ ] AI-powered recommendations
- [ ] Video interviews
- [ ] Payment integration
- [ ] Mobile app
- [ ] Email notifications
- [ ] Advanced analytics

### Phase 4 - Scale (📋 Planned)

- [ ] Multi-language support
- [ ] API documentation
- [ ] Third-party integrations
- [ ] Automated testing
- [ ] Performance optimization

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- **Development Team** - Initial work and features
- **Contributors** - See [GitHub contributors](https://github.com/Smokey053/Career-Findr/graphs/contributors)

---

## 🙏 Acknowledgments

- Material-UI for the component library
- Firebase for backend services
- React community for excellent documentation
- All contributors and testers

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/Smokey053/Career-Findr/issues)
- **Email**: support@career-findr.com

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Material-UI, Firebase, and modern web technologies**

**Status**: ✅ Production Ready | **Version**: 2.0.0 | **Last Updated**: December 2024
```````
