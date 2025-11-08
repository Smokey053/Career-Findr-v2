# 🎯 Backend Configuration - Complete Checklist

## 📋 Quick Reference

**Backend Status:** ⏳ Needs Configuration  
**What's Needed:** Firebase Admin SDK credentials  
**Time Required:** 5-10 minutes

---

## ✅ Configuration Checklist

### Phase 1: Get Firebase Credentials

- [ ] Go to [Firebase Console - Service Accounts](https://console.firebase.google.com/project/career-findr/settings/serviceaccounts/adminsdk)
- [ ] Click "Generate new private key"
- [ ] Save as `serviceAccountKey.json` in project root
- [ ] **IMPORTANT:** Never commit this file to Git (already in .gitignore)

### Phase 2: Configure Backend

Choose ONE method:

**Method A: Automatic (Recommended)**

- [ ] Run: `.\configure-backend.ps1`
- [ ] Script will automatically update `.env` with credentials

**Method B: Manual**

- [ ] Open `serviceAccountKey.json`
- [ ] Copy values to root `.env` file:
  ```env
  FIREBASE_PRIVATE_KEY_ID=...
  FIREBASE_PRIVATE_KEY="..."
  FIREBASE_CLIENT_EMAIL=...
  FIREBASE_CLIENT_ID=...
  FIREBASE_CLIENT_CERT_URL=...
  ```

### Phase 3: Configure Client

- [ ] Open `client/career-findr/.env`
- [ ] Uncomment or add: `VITE_API_URL=http://localhost:5000/api`
- [ ] Save file

### Phase 4: Start Servers

- [ ] Terminal 1: `npm run dev` (starts backend on port 5000)
- [ ] Terminal 2: `cd client/career-findr && npm run dev` (starts frontend on port 5173)

### Phase 5: Verify

- [ ] Backend health check: http://localhost:5000/api/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Test signup/login (should see API requests in backend terminal)

---

## 📚 Documentation Files

| File                     | Purpose                             |
| ------------------------ | ----------------------------------- |
| `BACKEND_QUICK_START.md` | 5-step quick start guide            |
| `BACKEND_SETUP_GUIDE.md` | Comprehensive setup documentation   |
| `configure-backend.ps1`  | Automated configuration script      |
| `BACKEND_CHECKLIST.md`   | This file - configuration checklist |

---

## 🔧 Environment Variables Reference

### Required in Root `.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Firebase Project
FIREBASE_PROJECT_ID=career-findr

# Firebase Admin SDK (from service account key)
FIREBASE_PRIVATE_KEY_ID=<from JSON>
FIREBASE_PRIVATE_KEY="<from JSON - keep quotes and \n>"
FIREBASE_CLIENT_EMAIL=<from JSON>
FIREBASE_CLIENT_ID=<from JSON>
FIREBASE_CLIENT_CERT_URL=<from JSON>

# JWT for authentication
JWT_SECRET=career-platform-secret-key-change-in-production-12345678
JWT_EXPIRES_IN=7d
```

### Required in `client/career-findr/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Backend Features

Once configured, your backend provides:

✅ **Authentication API**

- User registration with Firebase Auth
- Login with JWT tokens
- Password reset
- Email verification

✅ **Student Portal API**

- Profile management
- Course browsing & applications
- Job search & applications
- Application tracking

✅ **Institution Portal API**

- Course creation & management
- Application review
- Student admission management
- Analytics dashboard

✅ **Company Portal API**

- Job posting management
- Candidate search
- Application review
- Interview scheduling

✅ **Admin Portal API**

- User management
- Platform statistics
- Content moderation
- System monitoring

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'firebase-admin'"

**Solution:**

```powershell
npm install
```

### Issue: Backend starts but client can't connect

**Solution:**

1. Check backend is running: http://localhost:5000/api/health
2. Verify `VITE_API_URL` in `client/career-findr/.env`
3. Restart client dev server: `cd client/career-findr && npm run dev`

### Issue: "Firebase Admin initialization failed"

**Solution:**

1. Verify all Firebase credentials in `.env`
2. Ensure `FIREBASE_PRIVATE_KEY` is wrapped in double quotes
3. Check that `\n` characters are preserved (not actual newlines)
4. Regenerate service account key if needed

### Issue: "Port 5000 is already in use"

**Solution:**

1. Change `PORT=5001` in root `.env`
2. Change `VITE_API_URL=http://localhost:5001/api` in client `.env`
3. Restart both servers

### Issue: CORS errors in browser

**Solution:**

1. Check `CLIENT_URL` in root `.env` matches your client URL
2. Default is `http://localhost:5173` for Vite
3. Restart backend after changing

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Never commit `serviceAccountKey.json`
- [ ] Never commit `.env` files
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Set up Firebase security rules
- [ ] Enable Firebase App Check
- [ ] Use environment-specific configs
- [ ] Monitor API usage

---

## 📊 Architecture Overview

```
┌─────────────────┐
│  React Client   │  (Port 5173)
│  (Vite Dev)     │
└────────┬────────┘
         │ HTTP Requests
         │ (VITE_API_URL)
         ▼
┌─────────────────┐
│  Express API    │  (Port 5000)
│  (Node.js)      │
└────────┬────────┘
         │ Firebase Admin SDK
         ▼
┌─────────────────┐
│  Firebase       │
│  - Auth         │
│  - Firestore    │
│  - Storage      │
└─────────────────┘
```

---

## 🎯 Next Steps After Setup

1. **Test Core Features**

   - [ ] User registration
   - [ ] User login
   - [ ] Profile updates
   - [ ] File uploads

2. **Customize Business Logic**

   - [ ] Review controllers in `server/controllers/`
   - [ ] Modify validation rules in `server/middleware/`
   - [ ] Add custom routes if needed

3. **Set Up Testing**

   - [ ] Write unit tests for controllers
   - [ ] Write integration tests for API endpoints
   - [ ] Test error handling

4. **Prepare for Production**
   - [ ] Set up production environment variables
   - [ ] Choose deployment platform (Heroku, AWS, Cloud Functions)
   - [ ] Set up monitoring and logging
   - [ ] Configure production database

---

## 📞 Support

**Quick Help:**

1. Check terminal output for error messages
2. Verify `.env` configuration
3. Test backend health endpoint
4. Check browser console for client errors

**Documentation:**

- Quick Start: `BACKEND_QUICK_START.md`
- Full Guide: `BACKEND_SETUP_GUIDE.md`
- Deployment: `DEPLOYMENT_CHECKLIST.md`

---

**Last Updated:** November 7, 2025  
**Status:** Ready for configuration  
**Required Action:** Download Firebase service account key and run setup
