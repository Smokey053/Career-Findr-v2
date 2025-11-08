# 🔧 Backend Server Setup Guide

This guide will help you configure and run the Node.js/Express backend server for Career Findr.

---

## 📋 Prerequisites

✅ Node.js 18+ installed  
✅ Firebase project created (career-findr)  
✅ Backend dependencies installed (`npm install`)

---

## 🔥 Step 1: Get Firebase Admin SDK Credentials

### 1.1 Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **career-findr**

### 1.2 Generate Service Account Key

1. Click the **⚙️ Gear icon** (Settings) → **Project settings**
2. Navigate to the **Service accounts** tab
3. Click **Generate new private key**
4. Click **Generate key** in the confirmation dialog
5. Save the downloaded JSON file as `serviceAccountKey.json` in your project root

**⚠️ SECURITY WARNING:** Never commit this file to Git! It's already in `.gitignore`.

---

## 🔐 Step 2: Configure Environment Variables

### 2.1 Extract Credentials from Service Account Key

Open the downloaded `serviceAccountKey.json` file and copy these values:

```json
{
  "type": "service_account",
  "project_id": "career-findr",
  "private_key_id": "abc123...",           // Copy this
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",  // Copy this (keep \n)
  "client_email": "firebase-adminsdk-xxxxx@career-findr.iam.gserviceaccount.com",  // Copy this
  "client_id": "123456789",                 // Copy this
  ...
}
```

### 2.2 Update Root `.env` File

Open the `.env` file in your project root and add the Firebase Admin credentials:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Set to false to skip emulators (no Java required)
USE_EMULATOR=false

# Firebase Configuration
FIREBASE_PROJECT_ID=career-findr

# Firebase Admin SDK Credentials
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@career-findr.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id_here
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40career-findr.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=career-platform-secret-key-change-in-production-12345678
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Important Notes:**

- Replace `your_private_key_id_here` with the actual value
- The `FIREBASE_PRIVATE_KEY` must be wrapped in **double quotes** and keep the `\n` characters
- Replace all other placeholders with actual values from your service account key

---

## 💻 Step 3: Configure Client to Use Backend

### 3.1 Update Client `.env` File

Open `client/career-findr/.env` and uncomment the API URL:

```env
# API Settings (if you have a backend server)
VITE_API_URL=http://localhost:5000/api
```

### 3.2 Rebuild Client (if running)

If your client is running, restart it to pick up the new environment variable:

```powershell
cd client/career-findr
npm run dev
```

---

## 🚀 Step 4: Start the Backend Server

### 4.1 Development Mode (with auto-reload)

```powershell
cd "C:\Users\lefat\Documents\Web Design\Assignments\Group Assignment"
npm run dev
```

### 4.2 Production Mode

```powershell
npm start
```

### 4.3 Expected Output

```
🚀 Server running on port 5000
📚 Career Platform Backend API
🔗 Health check: http://localhost:5000/api/health
📝 Environment: development
```

---

## ✅ Step 5: Test Backend Connection

### 5.1 Test Health Endpoint

Open your browser or use PowerShell:

```powershell
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" | Select-Object -ExpandProperty Content
```

Expected response:

```json
{
  "status": "OK",
  "message": "Career Platform API is running",
  "timestamp": "2025-11-07T...",
  "environment": "development"
}
```

### 5.2 Test Client Connection

1. Start both servers:

   - **Backend**: `npm run dev` (in root folder)
   - **Client**: `npm run dev` (in client/career-findr folder)

2. Open browser: `http://localhost:5173`

3. Try to **Sign Up** or **Login** - you should see API requests in the backend terminal

---

## 🔧 Backend API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Students (`/api/students`)

- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `GET /api/students/courses` - Browse courses
- `POST /api/students/courses/apply` - Apply for course
- `GET /api/students/applications` - View applications
- `GET /api/students/jobs` - Browse jobs
- `POST /api/students/jobs/apply` - Apply for job

### Institutions (`/api/institutes`)

- `GET /api/institutes/profile` - Get institution profile
- `PUT /api/institutes/profile` - Update institution profile
- `POST /api/institutes/courses` - Create course
- `GET /api/institutes/courses` - List courses
- `PUT /api/institutes/courses/:id` - Update course
- `DELETE /api/institutes/courses/:id` - Delete course
- `GET /api/institutes/courses/:id/applications` - View course applications

### Companies (`/api/companies`)

- `GET /api/companies/profile` - Get company profile
- `PUT /api/companies/profile` - Update company profile
- `POST /api/companies/jobs` - Create job posting
- `GET /api/companies/jobs` - List jobs
- `PUT /api/companies/jobs/:id` - Update job
- `GET /api/companies/jobs/:id/applications` - View job applications
- `GET /api/companies/candidates/search` - Search candidates

### Admin (`/api/admin`)

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```powershell
npm install
```

### Error: "Port 5000 is already in use"

Change the port in `.env`:

```env
PORT=5001
```

Then update client `.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

### Error: "Firebase Admin initialization failed"

- Check that all Firebase Admin credentials are correct in `.env`
- Ensure `FIREBASE_PRIVATE_KEY` is wrapped in double quotes
- Verify service account key is valid and not expired

### Backend starts but client can't connect

1. Check backend is running: `http://localhost:5000/api/health`
2. Verify client `.env` has correct `VITE_API_URL`
3. Restart client dev server to pick up new env variables
4. Check browser console for CORS errors
5. Verify `CLIENT_URL` in backend `.env` matches your client URL

### Firebase Admin SDK errors

- Ensure Firebase project ID matches in both `.env` files
- Check service account has proper permissions in Firebase Console
- Regenerate service account key if necessary

---

## 📁 Project Structure

```
Career-Findr/
├── server/                    # Backend API
│   ├── config/               # Firebase Admin, DB config
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── instituteController.js
│   │   ├── companyController.js
│   │   └── adminController.js
│   ├── middleware/           # Auth, validation, error handling
│   │   ├── authMiddleware.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── instituteRoutes.js
│   │   ├── companyRoutes.js
│   │   └── adminRoutes.js
│   └── server.js            # Main server file
├── client/career-findr/      # React frontend
├── .env                      # Backend environment variables
├── serviceAccountKey.json    # Firebase Admin credentials (DO NOT COMMIT)
└── package.json              # Backend dependencies
```

---

## 🔐 Security Best Practices

1. **Never commit** `serviceAccountKey.json` or `.env` files
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Enable rate limiting** for production
5. **Validate all inputs** on the backend
6. **Use environment-specific** configurations

---

## 🚀 Running in Production

### Environment Variables

Create `.env.production`:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://career-findr.web.app

# Firebase configuration (same as development)
FIREBASE_PROJECT_ID=career-findr
# ... (add all Firebase Admin credentials)

# Strong JWT secret
JWT_SECRET=your-super-secure-random-string-here

# Production email settings
EMAIL_SERVICE=gmail
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### Deployment Options

**Option 1: Firebase Cloud Functions**

- Deploy backend as Cloud Functions
- Automatically scales
- No server management

**Option 2: Heroku**

```bash
heroku create career-findr-api
git push heroku master
heroku config:set NODE_ENV=production
# Set all environment variables
```

**Option 3: VPS (Digital Ocean, AWS, etc.)**

```bash
# Install Node.js on server
# Clone repository
# npm install
# Use PM2 for process management
npm install -g pm2
pm2 start server/server.js --name career-findr-api
pm2 startup
pm2 save
```

---

## 📊 Monitoring & Logs

### View Logs (Development)

Logs are displayed in the terminal running `npm run dev`

### View Logs (Production with PM2)

```bash
pm2 logs career-findr-api
pm2 monit
```

---

## 🔄 Next Steps After Setup

1. ✅ Backend server running on `http://localhost:5000`
2. ✅ Client pointing to backend via `VITE_API_URL`
3. ✅ Health check passing
4. ✅ Test registration/login flow
5. 📝 Implement any custom business logic
6. 🧪 Write API tests
7. 🚀 Deploy to production

---

## 📞 Need Help?

- **Backend not starting?** Check the error message and verify `.env` configuration
- **Client can't connect?** Verify both servers are running and URLs match
- **Firebase errors?** Double-check service account credentials
- **Port conflicts?** Change `PORT` in backend `.env` and `VITE_API_URL` in client `.env`

---

**Status**: 📖 Follow these steps to get your backend running!

**Next**: After completing setup, update this checklist:

- [ ] Downloaded service account key
- [ ] Added Firebase Admin credentials to `.env`
- [ ] Backend server starts successfully
- [ ] Health check endpoint responds
- [ ] Client `.env` updated with API URL
- [ ] Registration/login working through backend
