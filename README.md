# Career Guidance and Employment Integration Platform

A comprehensive backend API for a career guidance and employment platform built with Node.js, Express.js, and Firebase.

## 🚀 Features

- **User Authentication**: Registration, login, password management with Firebase Auth & JWT
- **User Management**: Profile management, role-based access control (Jobseeker, Employer, Admin)
- **Job Management**: Create, read, update, delete job postings
- **Job Applications**: Apply for jobs, track application status
- **Advanced Search**: Search and filter jobs by various criteria
- **Saved Jobs**: Bookmark jobs for later viewing
- **Application Tracking**: Track application status and employer feedback

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth, JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## 📁 Project Structure

```
career-platform/
├── server/
│   ├── config/
│   │   ├── firebase.js       # Firebase configuration
│   │   └── config.js         # App configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── userController.js       # User management
│   │   ├── jobController.js        # Job management
│   │   └── applicationController.js # Application management
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Job.js            # Job model
│   │   └── Application.js    # Application model
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   ├── userRoutes.js     # User endpoints
│   │   ├── jobRoutes.js      # Job endpoints
│   │   └── applicationRoutes.js # Application endpoints
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── utils/
│   │   └── helpers.js        # Helper functions
│   └── server.js             # Entry point
├── .env.example              # Environment variables template
├── .gitignore
└── package.json
```

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### 2. Clone Repository

```bash
git clone https://github.com/Smokey053/Career-Findr.git
cd "Group Assignment"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create Database"
   - Select "Start in production mode" or "test mode"
   
4. Enable **Authentication**:
   - Go to Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

5. Get Firebase Admin SDK credentials:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely

6. Get Firebase Client configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the config object

### 5. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (from downloaded JSON file)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Firebase Client Configuration (from web app config)
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 6. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| PUT | `/change-password` | Change password | Private |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/verify-email` | Verify email | Private |
| POST | `/logout` | Logout user | Private |
| DELETE | `/account` | Delete account | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/:id` | Get user by ID | Public |
| GET | `/` | Get all users | Admin |
| GET | `/search` | Search users | Employer/Admin |
| GET | `/saved-jobs` | Get saved jobs | Jobseeker |
| POST | `/saved-jobs/:jobId` | Save a job | Jobseeker |
| DELETE | `/saved-jobs/:jobId` | Remove saved job | Jobseeker |
| DELETE | `/:id` | Delete user | Admin |

### Jobs (`/api/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all jobs | Public |
| GET | `/search` | Search jobs | Public |
| GET | `/featured` | Get featured jobs | Public |
| GET | `/my/jobs` | Get my posted jobs | Employer |
| GET | `/employer/:employerId` | Get jobs by employer | Public |
| GET | `/:id` | Get job by ID | Public |
| POST | `/` | Create job | Employer |
| PUT | `/:id` | Update job | Employer (own) |
| DELETE | `/:id` | Delete job | Employer (own) |

### Applications (`/api/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Apply for job | Jobseeker |
| GET | `/` | Get all applications | Admin |
| GET | `/my-applications` | Get my applications | Jobseeker |
| GET | `/received` | Get received applications | Employer |
| GET | `/stats` | Get application stats | Employer |
| GET | `/:id` | Get application by ID | Authorized users |
| PUT | `/:id/status` | Update application status | Employer |
| DELETE | `/:id` | Withdraw application | Jobseeker |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 User Roles

- **Jobseeker**: Can apply for jobs, save jobs, manage applications
- **Employer**: Can post jobs, view applications, manage job listings
- **Admin**: Full access to all resources

## 🧪 Example Requests

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "jobseeker"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Create Job (Employer)

```bash
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Frontend Developer",
  "company": "Tech Corp",
  "location": "New York, NY",
  "type": "full-time",
  "description": "We are looking for an experienced frontend developer...",
  "requirements": ["React", "JavaScript", "CSS"],
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  }
}
```

### Apply for Job (Jobseeker)

```bash
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job-id-here",
  "coverLetter": "I am excited to apply for this position...",
  "resume": "https://example.com/resume.pdf"
}
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Firebase Auth integration
- Input validation and sanitization
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configuration

## 🐛 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 📝 Development

### Install dev dependencies

```bash
npm install --save-dev nodemon
```

### Run in development mode

```bash
npm run dev
```

## 🚀 Deployment

### Environment Variables

Make sure to set all environment variables in your hosting platform.

### Recommended Platforms

- **Heroku**
- **Google Cloud Platform**
- **AWS**
- **Render**
- **Railway**

## 📄 License

MIT License

## 👨‍💻 Author

Career Platform Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your-email@example.com

---

**Note**: Remember to never commit your `.env` file or Firebase credentials to version control!
