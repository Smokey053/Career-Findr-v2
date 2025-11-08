# Quick Start - Backend Setup

## 🚀 Quick 5-Step Setup

### Step 1: Get Firebase Service Account Key

1. Open: https://console.firebase.google.com/project/career-findr/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Click **"Generate key"**
4. Save the file as `serviceAccountKey.json` in your project root folder

### Step 2: Update `.env` File

Open the `.env` file in your root folder and add these lines from your downloaded JSON file:

```env
# Copy these from serviceAccountKey.json:
FIREBASE_PRIVATE_KEY_ID=paste_value_here
FIREBASE_PRIVATE_KEY="paste_full_key_with_quotes"
FIREBASE_CLIENT_EMAIL=paste_email_here
FIREBASE_CLIENT_ID=paste_id_here
FIREBASE_CLIENT_CERT_URL=paste_url_here
```

### Step 3: Enable Backend in Client

Open `client/career-findr/.env` and change line 20 to:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Backend

```powershell
npm run dev
```

### Step 5: Start Client (in a new terminal)

```powershell
cd client/career-findr
npm run dev
```

---

## ✅ Verification

Open http://localhost:5000/api/health in your browser. You should see:

```json
{
  "status": "OK",
  "message": "Career Platform API is running"
}
```

---

## 🎉 Done!

Your backend is now running and connected to Firebase!

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Admin Console**: https://console.firebase.google.com/project/career-findr

---

## ⚠️ Troubleshooting

**Backend won't start?**

- Make sure you added all Firebase credentials to `.env`
- The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes

**Client can't connect?**

- Make sure `VITE_API_URL=http://localhost:5000/api` in `client/career-findr/.env`
- Restart the client dev server after changing `.env`

**Still need help?**
See the full guide: `BACKEND_SETUP_GUIDE.md`
