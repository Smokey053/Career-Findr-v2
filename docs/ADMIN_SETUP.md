# Admin Setup Guide

## Creating Admin Account

To create an admin account in Career Findr, follow these steps:

### Method 1: Manual Firebase Setup (Recommended)

1. **Create the user account via Firebase Console**:

   - Go to Firebase Console → Authentication
   - Click "Add user"
   - Email: `admin@careerfindr.com`
   - Password: `admin123`
   - Copy the User UID

2. **Create admin user document in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Navigate to `users` collection
   - Click "Add document"
   - Document ID: Use the User UID from step 1
   - Add fields:
     ```
     email: "admin@careerfindr.com"
     role: "admin"
     name: "Admin User"
     phone: ""
     createdAt: [Current Timestamp]
     updatedAt: [Current Timestamp]
     active: true
     ```

### Method 2: Using Firebase Admin SDK (Backend)

If you have a backend setup, create a script:

```javascript
// scripts/createAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function createAdmin() {
  try {
    // Create auth user
    const userRecord = await admin.auth().createUser({
      email: "admin@careerfindr.com",
      password: "admin123",
      displayName: "Admin User",
    });

    console.log("Successfully created user:", userRecord.uid);

    // Create Firestore document
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email: "admin@careerfindr.com",
      role: "admin",
      name: "Admin User",
      phone: "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      active: true,
    });

    console.log("Successfully created admin document");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

createAdmin();
```

Run: `node scripts/createAdmin.js`

### Method 3: Sign Up and Manually Change Role

1. Sign up normally at `/signup`
2. After account creation, go to Firestore
3. Find your user document
4. Change `role` field from `student` to `admin`
5. Refresh your app

## Admin Credentials

**Default Demo Admin**:

- Email: `admin@careerfindr.com`
- Password: `admin123`

**⚠️ Important**: Change these credentials in production!

## Admin Permissions

Admin users have access to:

- ✅ All user management
- ✅ Platform statistics dashboard
- ✅ Role impersonation feature
- ✅ Export all data
- ✅ Monitor platform activity
- ✅ System configuration

## Security Notes

1. **Change default password** immediately after first login
2. **Enable 2FA** for admin accounts (if implemented)
3. **Limit admin accounts** to trusted personnel only
4. **Regularly audit** admin actions
5. **Use strong passwords** with mix of uppercase, lowercase, numbers, symbols

## Firestore Security Rules

Ensure your admin security rules are in place:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection - admin can read/write all
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if true; // Allow user creation during signup
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    // All other collections - admin has full access
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

## Testing Admin Access

After creating admin account:

1. Login at `/login`
2. Should redirect to `/dashboard/admin`
3. Verify access to:
   - User management
   - Statistics
   - Impersonation feature
   - Export functionality

## Troubleshooting

### Can't login as admin

- Check user exists in Authentication
- Verify role is set to "admin" in Firestore users collection
- Check security rules allow admin access
- Clear browser cache and try again

### Dashboard not loading

- Verify admin role in Firestore
- Check browser console for errors
- Ensure all admin routes are protected correctly

### Permission denied errors

- Update Firestore security rules
- Verify admin role check in rules
- Check IndexedDB/localStorage for stale data

## Additional Admin Users

To create additional admin users, repeat Method 1 or Method 2 with different email addresses.

**Recommended naming convention**:

- admin@careerfindr.com (Super Admin)
- admin.{name}@careerfindr.com (Other admins)

## Production Checklist

- [ ] Change default admin password
- [ ] Set up admin email alerts
- [ ] Configure admin activity logging
- [ ] Implement admin session timeout
- [ ] Enable MFA for admin accounts
- [ ] Create backup admin account
- [ ] Document admin procedures
- [ ] Set up admin access monitoring

---

**Last Updated**: December 2024  
**Security Level**: High Priority
