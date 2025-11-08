# 🧪 Testing Checklist - Career Findr Advanced Features

Use this checklist to verify all new features are working correctly.

---

## 🔔 Notifications System

### Basic Functionality

- [ ] Notification icon appears in navbar
- [ ] Unread count badge displays correctly
- [ ] Click notification icon opens dropdown
- [ ] Notifications list displays in dropdown
- [ ] Empty state shows when no notifications

### Real-time Updates

- [ ] New notifications appear instantly (create one in Firestore console)
- [ ] Unread count updates immediately
- [ ] Notification dropdown updates without refresh

### Interaction

- [ ] Click notification marks it as read
- [ ] Unread badge decreases when notification read
- [ ] "Mark all as read" button works
- [ ] Click notification navigates to correct link
- [ ] Dropdown closes after clicking notification

### Full Page

- [ ] Navigate to `/notifications` works
- [ ] All notifications display on page
- [ ] Tabs work (All, Unread, Read)
- [ ] Notifications grouped by time (Today, Yesterday, etc.)
- [ ] Time displays correctly ("5 minutes ago")
- [ ] Different notification types show correct icons/colors

---

## 📅 Calendar Integration

### Calendar Page

- [ ] Navigate to `/calendar` works
- [ ] Calendar displays with current month
- [ ] Switch between Month/Week/Day/Agenda views
- [ ] Events display on calendar
- [ ] Click event opens details dialog
- [ ] Upcoming events sidebar shows next 5 events
- [ ] Event type legend displays

### Calendar Scheduler

- [ ] Open scheduler from ApplicantReview page
- [ ] Click time slot opens event form
- [ ] Drag to select time range works
- [ ] Event form fields populate correctly
- [ ] Event type dropdown works
- [ ] Location field accepts input
- [ ] Meeting link field accepts input
- [ ] "Add to Google Calendar" button works
- [ ] "Export .ICS" downloads file
- [ ] "Schedule Interview" creates event

### Real-time Sync

- [ ] New events appear immediately
- [ ] Event updates sync across users
- [ ] Event status changes reflect instantly

### Event Management

- [ ] View event details
- [ ] Mark event as completed
- [ ] Cancel event
- [ ] Delete event (creator only)
- [ ] Event colors match type

---

## 🔖 Saved Items

### Navigation

- [ ] Bookmark icon appears in navbar
- [ ] Click bookmark icon navigates to `/saved`
- [ ] Page loads without errors

### Functionality

- [ ] Jobs tab displays saved jobs
- [ ] Courses tab displays saved courses
- [ ] Tab switching works smoothly
- [ ] Empty state shows when no items
- [ ] "Remove" button appears on items
- [ ] Remove confirmation works
- [ ] Item removed from list after confirmation
- [ ] "Apply Now" / "View Details" navigation works

### Responsive Design

- [ ] 2-column grid on desktop
- [ ] Single column on mobile
- [ ] Touch interactions work on mobile

---

## 💬 Messaging System

### Navigation

- [ ] Message icon appears in navbar
- [ ] Click message icon navigates to `/messages`
- [ ] Page loads without errors

### Conversation List

- [ ] Conversations list displays
- [ ] Search conversations works
- [ ] Unread count badge shows on conversations
- [ ] Online status indicators display
- [ ] Click conversation selects it
- [ ] Selected conversation highlighted

### Chat Window

- [ ] Messages display in correct order
- [ ] Own messages on right, others on left
- [ ] Message colors correct (own vs others)
- [ ] Timestamps display correctly
- [ ] Auto-scroll to bottom on new message

### Sending Messages

- [ ] Type message in input field
- [ ] Enter key sends message
- [ ] Shift+Enter adds new line
- [ ] Send button works
- [ ] Message appears immediately
- [ ] Input clears after sending

### Real-time Updates

- [ ] New messages appear instantly
- [ ] Conversation list updates with last message
- [ ] Unread count updates
- [ ] Online status updates

---

## 📄 File Preview

### PDF Files

- [ ] PDF preview opens
- [ ] PDF displays correctly
- [ ] Zoom in/out buttons work
- [ ] Zoom percentage displays
- [ ] Previous/Next page buttons work
- [ ] Page counter shows "X / Y"
- [ ] Download button works

### Images

- [ ] Image preview opens
- [ ] Image displays at correct size
- [ ] Image fits in viewport
- [ ] Download button works

### Videos

- [ ] Video player displays
- [ ] Play/pause controls work
- [ ] Volume controls work
- [ ] Fullscreen works
- [ ] Download button works

### Text Files

- [ ] Text preview displays
- [ ] Content readable
- [ ] Scrolling works for long files
- [ ] Download button works

### Unsupported Files

- [ ] Shows "Preview not available" message
- [ ] Shows download button
- [ ] Download works

---

## 📊 Export & Reports

### Export Button

- [ ] Export button appears where integrated
- [ ] Button disabled when no data
- [ ] Click opens format menu
- [ ] Loading indicator shows during export

### CSV Export

- [ ] CSV file downloads
- [ ] Opens in Excel/Sheets
- [ ] All columns present
- [ ] Data accurate

### Excel Export

- [ ] .xlsx file downloads
- [ ] Opens in Excel
- [ ] Formatting preserved
- [ ] All data present

### PDF Export

- [ ] PDF file downloads
- [ ] Opens in PDF reader
- [ ] Title displays
- [ ] Date stamp present
- [ ] Table formatted correctly
- [ ] All rows included

### JSON Export

- [ ] JSON file downloads
- [ ] Valid JSON format
- [ ] All data included
- [ ] Pretty-printed

---

## 👤 Role Impersonation

### Starting Impersonation

- [ ] "View as User" option shows in UserManagement
- [ ] Only admins see this option
- [ ] Click "View as User" starts impersonation
- [ ] Navigates to user's dashboard
- [ ] User context switches correctly

### Impersonation Banner

- [ ] Orange warning banner appears at top
- [ ] Shows impersonated user email/role
- [ ] Shows original admin email
- [ ] "Exit Impersonation" button visible

### During Impersonation

- [ ] See platform as impersonated user
- [ ] Correct dashboard displays
- [ ] Correct permissions applied
- [ ] Correct data visible
- [ ] Cannot access admin functions (except banner)

### Exiting Impersonation

- [ ] Click "Exit Impersonation" works
- [ ] Returns to admin user context
- [ ] Navigates back to admin panel
- [ ] Banner disappears
- [ ] Admin functions restored

### Session Persistence

- [ ] Refresh page maintains impersonation
- [ ] Session storage saves state
- [ ] Can close tab and reopen
- [ ] Exit clears session properly

---

## 🎨 UI/UX Testing

### Navbar

- [ ] All icons visible and aligned
- [ ] Icons have tooltips
- [ ] Badges display correctly
- [ ] Click actions work
- [ ] Mobile hamburger menu works

### Responsive Design

- [ ] All pages work on mobile (320px+)
- [ ] All pages work on tablet (768px+)
- [ ] All pages work on desktop (1024px+)
- [ ] Touch interactions work on mobile
- [ ] Scrolling works properly

### Loading States

- [ ] Spinners show during data fetch
- [ ] Skeleton screens where appropriate
- [ ] "Loading..." text displays
- [ ] No flash of empty content

### Empty States

- [ ] Helpful messages show
- [ ] CTAs present (when applicable)
- [ ] Icons/illustrations show
- [ ] No broken layouts

### Error Handling

- [ ] Error messages display
- [ ] Console errors logged
- [ ] App doesn't crash
- [ ] User can recover from errors

---

## 🔐 Security Testing

### Authentication

- [ ] Can't access features while logged out
- [ ] Redirects to login when needed
- [ ] Protected routes work correctly

### Authorization

- [ ] Students can't access admin features
- [ ] Institutes can't access company features
- [ ] Companies can't access institute features
- [ ] Only admins can impersonate

### Data Access

- [ ] Users only see their own notifications
- [ ] Users only see their conversations
- [ ] Users only see events they're invited to
- [ ] Can't access other users' data

---

## 🚀 Performance Testing

### Page Load

- [ ] Pages load in under 2 seconds
- [ ] No unnecessary re-renders
- [ ] Images lazy load
- [ ] No memory leaks

### Real-time Updates

- [ ] Updates appear within 1 second
- [ ] No lag in UI
- [ ] Efficient Firestore queries
- [ ] Listeners clean up properly

### Export Performance

- [ ] Export completes in under 5 seconds (1000 rows)
- [ ] UI doesn't freeze during export
- [ ] Loading indicator shows
- [ ] Large exports work correctly

---

## 🐛 Common Issues & Fixes

### Issue: Notifications not appearing

**Check:**

- [ ] NotificationProvider wraps app
- [ ] userId matches in Firestore
- [ ] Firestore rules allow read
- [ ] No console errors

### Issue: Calendar events not syncing

**Check:**

- [ ] participantIds includes current user
- [ ] Firestore indexes created
- [ ] Timestamps are valid
- [ ] No console errors

### Issue: Messages not sending

**Check:**

- [ ] Chat document exists
- [ ] senderId is correct
- [ ] Firestore rules allow write
- [ ] No console errors

### Issue: File preview fails

**Check:**

- [ ] File URL accessible
- [ ] File extension supported
- [ ] PDF.js worker loaded
- [ ] CORS headers correct

### Issue: Export downloads empty

**Check:**

- [ ] Data array not empty
- [ ] Data is array of objects
- [ ] Column names correct
- [ ] No console errors

### Issue: Impersonation not working

**Check:**

- [ ] User is admin
- [ ] ImpersonationProvider wraps app
- [ ] Session storage accessible
- [ ] No console errors

---

## ✅ Final Verification

### Before Deploy

- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Firebase rules updated
- [ ] Environment variables set
- [ ] Build completes successfully
- [ ] Production build tested

### After Deploy

- [ ] All pages load
- [ ] All features work
- [ ] Real-time updates work
- [ ] No 404 errors
- [ ] Analytics tracking
- [ ] Error monitoring active

---

## 📊 Testing Progress

Track your progress:

- **Notifications**: \_\_ / 16 tests passed
- **Calendar**: \_\_ / 25 tests passed
- **Saved Items**: \_\_ / 10 tests passed
- **Messages**: \_\_ / 16 tests passed
- **File Preview**: \_\_ / 16 tests passed
- **Export**: \_\_ / 16 tests passed
- **Impersonation**: \_\_ / 14 tests passed
- **UI/UX**: \_\_ / 25 tests passed
- **Security**: \_\_ / 11 tests passed
- **Performance**: \_\_ / 10 tests passed

**Total**: \_\_ / 159 tests passed

---

## 🎯 Test Coverage Goals

- [ ] 100% of critical paths tested
- [ ] 90%+ of features working
- [ ] All roles tested
- [ ] Mobile tested
- [ ] Tablet tested
- [ ] Desktop tested
- [ ] Real-time features verified
- [ ] Security verified

---

## 📝 Notes

Use this space to note any issues found:

```
Issue:
Steps to Reproduce:
Expected:
Actual:
Browser:
Device:
Fix:
```

---

**Testing Status**: 🔄 In Progress / ✅ Complete

**Tested By**: ******\_\_\_******
**Date**: ******\_\_\_******
**Environment**: Development / Staging / Production

---

Happy Testing! 🧪
