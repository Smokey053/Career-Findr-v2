# 🚀 Career Findr - Deployment Guide

Complete guide for deploying Career Findr to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Build & Deployment](#build--deployment)
5. [Post-Deployment](#post-deployment)
6. [CI/CD Setup](#cicd-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Tools

- Node.js 18+ and npm
- Git
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase account with Blaze plan (for production)

### Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable billing (Blaze plan for production features)
4. Register a web app

---

## ⚙️ Environment Setup

### 1. Production Environment Variables

Create `.env.production` in `client/career-findr/`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=career-findr.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=career-findr
VITE_FIREBASE_STORAGE_BUCKET=career-findr.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Environment
VITE_USE_EMULATOR=false
VITE_NODE_ENV=production

# API Endpoints (if using backend)
VITE_API_URL=https://api.career-findr.com
```

### 2. Security Checklist

Before deployment, ensure:

- [ ] All API keys are stored in environment variables
- [ ] Firebase security rules are deployed
- [ ] CORS is properly configured
- [ ] Authentication is required for protected routes
- [ ] File upload size limits are enforced
- [ ] Rate limiting is configured (if using backend)

---

## 🔥 Firebase Configuration

### 1. Deploy Firestore Security Rules

```bash
cd client/career-findr
firebase init firestore
# Select existing project
# Accept default rules file location
```

Update `firestore.rules` with production rules from `FIREBASE_SETUP_COMPLETE.md`

```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Storage Security Rules

```bash
firebase init storage
# Select existing project
# Accept default rules file location
```

Update `storage.rules` with production rules from `FIREBASE_SETUP_COMPLETE.md`

```bash
firebase deploy --only storage
```

### 3. Create Firestore Indexes

```bash
# Create composite indexes
firebase deploy --only firestore:indexes
```

Required indexes (add to `firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "read", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
        { "fieldPath": "startTime", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "jobs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "chatId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 4. Enable Authentication Methods

1. Go to Firebase Console → Authentication
2. Enable sign-in methods:
   - Email/Password ✅
   - Google (optional) ✅
3. Configure authorized domains:
   - Add your production domain
   - Add localhost for testing

---

## 📦 Build & Deployment

### Option 1: Firebase Hosting (Recommended)

#### 1. Initialize Firebase Hosting

```bash
cd client/career-findr
firebase login
firebase init hosting
```

Select:

- **Existing project**: career-findr
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **GitHub actions**: `No` (we'll set up later)

#### 2. Update firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

#### 3. Build for Production

```bash
npm run build
```

This will:

- Create optimized production build
- Minify and bundle code
- Generate sourcemaps
- Output to `dist/` directory

#### 4. Test Production Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` and test all features.

#### 5. Deploy to Firebase

```bash
firebase deploy --only hosting
```

Your app will be live at: `https://career-findr.web.app`

### Option 2: Custom Domain Setup

#### 1. Add Custom Domain

```bash
firebase hosting:channel:deploy production
```

#### 2. Configure Domain in Firebase Console

1. Go to Hosting → Add custom domain
2. Enter your domain (e.g., `www.career-findr.com`)
3. Add DNS records provided by Firebase
4. Wait for SSL certificate provisioning (24-48 hours)

#### 3. Update Firebase Configuration

Add custom domain to authorized domains in Firebase Authentication.

### Option 3: Other Hosting Providers

#### Netlify

```bash
# Build
npm run build

# Deploy with Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=dist
```

Configure environment variables in Netlify dashboard.

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard.

---

## 🔄 Post-Deployment

### 1. Verify Deployment

Test the following:

- [ ] User registration and login
- [ ] Course browsing and applications
- [ ] Job search and applications
- [ ] File uploads (resume, profile images)
- [ ] Real-time notifications
- [ ] Calendar integration
- [ ] Messaging system
- [ ] Export functionality

### 2. Monitor Performance

```bash
# Firebase Performance Monitoring
firebase init performance
firebase deploy --only performance
```

### 3. Set Up Analytics

```bash
# Firebase Analytics
firebase init analytics
firebase deploy --only analytics
```

### 4. Configure Error Logging

Add error tracking service (e.g., Sentry):

```bash
npm install @sentry/react @sentry/tracing
```

Update `main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

---

## 🤖 CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: |
          cd client/career-findr
          npm ci

      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: |
          cd client/career-findr
          npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: career-findr
```

### Setup Steps

1. Generate Firebase service account:

```bash
firebase login:ci
# Copy the token
```

2. Add secrets to GitHub:

- Go to repository → Settings → Secrets
- Add `FIREBASE_SERVICE_ACCOUNT`
- Add all `VITE_*` environment variables

---

## 📊 Monitoring & Maintenance

### Performance Monitoring

1. **Firebase Performance**

   - Track page load times
   - Monitor API response times
   - Identify slow queries

2. **Google Analytics**
   - User engagement metrics
   - Conversion tracking
   - User flow analysis

### Database Maintenance

```bash
# Backup Firestore data
gcloud firestore export gs://career-findr-backup

# Schedule regular backups
# Set up in Google Cloud Console
```

### Storage Management

1. Set lifecycle policies for old files
2. Monitor storage usage
3. Clean up unused files

### Security Audits

Regular checks:

- [ ] Review security rules monthly
- [ ] Update dependencies (`npm audit`)
- [ ] Check for Firebase updates
- [ ] Review access logs
- [ ] Test authentication flows

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### 2. Firebase Deployment Fails

```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Re-login
firebase logout
firebase login
```

#### 3. Environment Variables Not Working

- Ensure variables start with `VITE_`
- Check `.env.production` file exists
- Restart dev server after changes
- Rebuild for production

#### 4. CORS Errors

Add to Firebase hosting config:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ]
  }
}
```

#### 5. 404 Errors on Refresh

Ensure rewrites are configured in `firebase.json`:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Performance Issues

1. **Slow Initial Load**

   - Enable code splitting
   - Lazy load components
   - Optimize images
   - Use CDN for assets

2. **Slow Firestore Queries**

   - Create composite indexes
   - Use pagination
   - Cache frequently accessed data
   - Denormalize data where appropriate

3. **High Storage Costs**
   - Compress images before upload
   - Set file size limits
   - Use Firebase Storage rules
   - Clean up old files

---

## 📞 Support & Resources

### Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)

### Monitoring Tools

- Firebase Console: https://console.firebase.google.com/
- Google Cloud Console: https://console.cloud.google.com/
- Sentry: https://sentry.io/

### Community

- Firebase Discord: https://discord.gg/firebase
- Stack Overflow: Tag with `firebase`, `react`, `vite`

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Firebase security rules deployed
- [ ] Firestore indexes created
- [ ] Custom domain configured (if applicable)

### Deployment

- [ ] Build succeeds
- [ ] Preview deployment works
- [ ] Production deployment succeeds
- [ ] DNS propagated (if custom domain)
- [ ] SSL certificate active

### Post-Deployment

- [ ] All features tested
- [ ] Authentication working
- [ ] File uploads working
- [ ] Real-time features working
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Analytics tracking

### Maintenance

- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Update schedule defined
- [ ] Security audit scheduled

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Status**: Production Ready ✅
