# Component API Reference

Quick reference guide for using the newly created components.

## 📁 Component Imports

```javascript
// Contexts
import { useNotifications } from "./contexts/NotificationContext";
import { useImpersonation } from "./contexts/ImpersonationContext";

// Components
import NotificationCenter from "./components/common/NotificationCenter";
import CalendarScheduler from "./components/common/CalendarScheduler";
import FilePreview from "./components/common/FilePreview";
import ExportButton from "./components/common/ExportButton";
import ImpersonationBanner from "./components/common/ImpersonationBanner";

// Pages
import SavedItems from "./pages/common/SavedItems";
import Messages from "./pages/common/Messages";
import Notifications from "./pages/common/Notifications";
import CalendarPage from "./pages/common/CalendarPage";
```

---

## 🔔 NotificationContext

### Hook Usage

```javascript
const {
  notifications, // Array of all notifications
  unreadCount, // Number of unread notifications
  loading, // Boolean loading state
  markAsRead, // Function(notificationId)
  markAllAsRead, // Function()
} = useNotifications();
```

### Create Notification (Backend/Firestore)

```javascript
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./config/firebase";

await addDoc(collection(db, "notifications"), {
  userId: "user-id",
  title: "Application Received",
  message: "Your application has been received successfully",
  type: "success", // success, error, info, application, job, message, interview, user, course
  link: "/applications", // optional
  read: false,
  createdAt: Timestamp.now(),
});
```

---

## 📅 CalendarScheduler Component

### Props

```javascript
<CalendarScheduler
  open={boolean}                    // Required: Dialog open state
  onClose={function}                // Required: Close handler
  applicantId={string}              // Optional: User ID to schedule with
  applicantName={string}            // Optional: Display name
  jobId={string}                    // Optional: Related job ID
  jobTitle={string}                 // Optional: Display job title
/>
```

### Example Usage

```javascript
const [calendarOpen, setCalendarOpen] = useState(false);

<Button onClick={() => setCalendarOpen(true)}>
  Schedule Interview
</Button>

<CalendarScheduler
  open={calendarOpen}
  onClose={() => setCalendarOpen(false)}
  applicantId="user123"
  applicantName="John Doe"
  jobId="job456"
  jobTitle="Software Engineer"
/>
```

---

## 📄 FilePreview Component

### Props

```javascript
<FilePreview
  open={boolean}                    // Required: Dialog open state
  onClose={function}                // Required: Close handler
  fileUrl={string}                  // Required: URL of file to preview
  fileName={string}                 // Required: Display filename
  fileType={string}                 // Optional: MIME type (auto-detected from extension)
/>
```

### Example Usage

```javascript
const [previewOpen, setPreviewOpen] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);

<Button onClick={() => {
  setSelectedFile({
    url: 'https://example.com/resume.pdf',
    name: 'resume.pdf',
    type: 'application/pdf'
  });
  setPreviewOpen(true);
}}>
  View Document
</Button>

<FilePreview
  open={previewOpen}
  onClose={() => setPreviewOpen(false)}
  fileUrl={selectedFile?.url}
  fileName={selectedFile?.name}
  fileType={selectedFile?.type}
/>
```

### Supported File Types

- **PDF**: `.pdf` - Full preview with zoom and pagination
- **Images**: `.jpg, .jpeg, .png, .gif, .bmp, .webp` - Image viewer
- **Video**: `.mp4, .webm, .ogg` - Video player
- **Text**: `.txt, .md, .json, .csv` - Text viewer
- **Other**: Download prompt

---

## 📊 ExportButton Component

### Props

```javascript
<ExportButton
  data={array} // Required: Array of objects to export
  filename={string} // Required: Base filename (without extension)
  columns={array} // Optional: Array of column keys to export
  title={string} // Optional: Title for PDF reports
  disabled={boolean} // Optional: Disable button
/>
```

### Example Usage

```javascript
const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    status: "active",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "company",
    status: "active",
  },
];

<ExportButton
  data={users}
  filename="user_report"
  columns={["name", "email", "role", "status"]}
  title="User Management Report"
/>;
```

### Export Formats

- **CSV**: Comma-separated values
- **Excel**: .xlsx format with proper formatting
- **PDF**: Formatted PDF with table and header
- **JSON**: Pretty-printed JSON format

---

## 👤 ImpersonationContext

### Hook Usage

```javascript
const {
  isImpersonating, // Boolean: Currently impersonating?
  impersonatedUser, // Object: User being impersonated
  originalUser, // Object: Original admin user
  startImpersonation, // Function(userObject)
  stopImpersonation, // Function()
  getActiveUser, // Function() returns current active user
} = useImpersonation();
```

### Example Usage

```javascript
// Start impersonating a user
const handleViewAsUser = (user) => {
  startImpersonation(user);
  navigate(`/dashboard/${user.role}`);
};

// Get the current active user (respects impersonation)
const currentUser = getActiveUser();

// Check if impersonating
if (isImpersonating) {
  console.log("Viewing as:", impersonatedUser.email);
  console.log("Original admin:", originalUser.email);
}

// Stop impersonating
stopImpersonation(); // Auto-navigates back to admin panel
```

---

## 💬 Messages Component (Page)

### No Props Required

This is a full page component. Simply route to it:

```javascript
<Route path="/messages" element={<Messages />} />
```

### Create a Chat (Firestore)

```javascript
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";
import { db } from "./config/firebase";

// Create chat document
const chatRef = await addDoc(collection(db, "chats"), {
  participants: ["userId1", "userId2"],
  participantsData: {
    userId1: { name: "User 1", avatar: "" },
    userId2: { name: "User 2", avatar: "" },
  },
  lastMessage: "",
  lastMessageTime: Timestamp.now(),
  unreadCount: 0,
  online: false,
});

// Send message
await addDoc(collection(db, "chats", chatRef.id, "messages"), {
  text: "Hello!",
  senderId: "userId1",
  senderName: "User 1",
  timestamp: Timestamp.now(),
  read: false,
});
```

---

## 📅 CalendarPage Component (Page)

### No Props Required

This is a full page component. Simply route to it:

```javascript
<Route path="/calendar" element={<CalendarPage />} />
```

### Create Event (Firestore)

```javascript
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./config/firebase";

await addDoc(collection(db, "events"), {
  title: "Interview with John Doe",
  description: "Technical interview for Software Engineer position",
  type: "interview", // interview, meeting, deadline, other
  location: "Remote",
  meetingLink: "https://zoom.us/j/123456789",
  startTime: Timestamp.fromDate(new Date("2024-12-15T10:00:00")),
  endTime: Timestamp.fromDate(new Date("2024-12-15T11:00:00")),
  participantIds: ["userId1", "userId2"],
  participantNames: ["Admin User", "John Doe"],
  jobId: "job123", // optional
  jobTitle: "Software Engineer", // optional
  createdBy: "adminId",
  createdAt: Timestamp.now(),
  status: "scheduled", // scheduled, completed, cancelled, rescheduled
});
```

---

## 🔖 SavedItems Component (Page)

### No Props Required

This is a full page component. Simply route to it:

```javascript
<Route path="/saved" element={<SavedItems />} />
```

### API Expected

The component expects your API to have:

```javascript
// In studentAPI or similar
async getSavedItems() {
  return {
    jobs: [
      { id: '1', title: 'Software Engineer', company: 'Tech Co', ... },
    ],
    courses: [
      { id: '1', name: 'Web Development', university: 'State U', ... },
    ],
  };
}

async removeSavedItem(itemId, type) {
  // type: 'job' or 'course'
  // Remove from saved items
}
```

---

## 🔔 NotificationCenter Component

### No Props Required

This component is designed to be used in the Navbar:

```javascript
import NotificationCenter from "./components/common/NotificationCenter";

function Navbar() {
  return (
    <AppBar>
      <Toolbar>
        {/* Other nav items */}
        <NotificationCenter />
        {/* User menu */}
      </Toolbar>
    </AppBar>
  );
}
```

---

## 🚨 ImpersonationBanner Component

### No Props Required

Place at the top level of your app (after Auth/Notification providers):

```javascript
import ImpersonationBanner from "./components/common/ImpersonationBanner";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ImpersonationProvider>
          <ImpersonationBanner /> {/* Shows only when impersonating */}
          <Routes>{/* Your routes */}</Routes>
        </ImpersonationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
```

---

## 🎨 Styling Notes

All components use:

- **Material-UI** for components and theming
- **Bootstrap Grid** for layout (col-12, col-md-6, etc.)
- **Consistent spacing**: Uses MUI spacing scale (sx={{ p: 2, m: 1 }})
- **Responsive design**: Mobile-first approach
- **Color scheme**: Primary (blue), Success (green), Error (red), Warning (orange)

---

## 🔥 Firebase Security Rules

Remember to update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notifications - user can only read their own
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Events - participants can read/write
    match /events/{eventId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.participantIds;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }

    // Chats - participants can read/write
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;

      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

---

## 📦 NPM Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check for dependency issues
npm audit

# Update dependencies
npm update
```

---

## 🐛 Debugging Tips

### Notifications not appearing?

1. Check Firebase console for notification documents
2. Verify userId matches authenticated user
3. Check browser console for errors
4. Ensure NotificationProvider wraps your app

### Calendar events not syncing?

1. Verify participantIds includes current user
2. Check Firestore indexes are created
3. Look for errors in browser console
4. Ensure dates are valid Timestamp objects

### File preview not working?

1. Check file URL is accessible (CORS)
2. Verify file extension is supported
3. For PDFs, check PDF.js worker URL
4. Check browser console for errors

### Impersonation not working?

1. Verify user is admin role
2. Check sessionStorage for impersonation data
3. Ensure ImpersonationProvider wraps app
4. Clear session storage and try again

---

## 📞 Quick Help

**Issue**: Real-time updates not working
**Solution**: Check that you're using `onSnapshot` not `getDocs`, and that Firestore rules allow read access

**Issue**: Export button downloads empty file
**Solution**: Verify `data` prop is an array of objects and not empty

**Issue**: Calendar shows wrong timezone
**Solution**: Moment.js uses local timezone by default. Store times in UTC and convert for display.

**Issue**: Messages not sending
**Solution**: Check chat exists in Firestore first, verify senderId matches authenticated user

---

**Happy Coding! 🚀**
