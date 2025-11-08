import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Close,
  Event as EventIcon,
  VideoCall,
  LocationOn,
} from "@mui/icons-material";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";

const localizer = momentLocalizer(moment);

export default function CalendarScheduler({
  open,
  onClose,
  applicantId,
  applicantName,
  jobId,
  jobTitle,
}) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "interview",
    location: "",
    meetingLink: "",
  });

  // Fetch events in real-time
  useEffect(() => {
    if (!user?.uid) return;

    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("participantIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        eventsData.push({
          id: doc.id,
          title: data.title,
          start: data.startTime.toDate(),
          end: data.endTime.toDate(),
          ...data,
        });
      });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate({ start, end });
    setEventForm({
      title: `Interview - ${applicantName || "Candidate"}`,
      description: `Interview for ${jobTitle || "Position"}`,
      type: "interview",
      location: "",
      meetingLink: "",
    });
    setShowEventDialog(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedDate({ start: event.start, end: event.end });
    setEventForm({
      title: event.title,
      description: event.description || "",
      type: event.type || "interview",
      location: event.location || "",
      meetingLink: event.meetingLink || "",
    });
    setShowEventDialog(true);
  };

  const handleScheduleInterview = async () => {
    try {
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        type: eventForm.type,
        location: eventForm.location,
        meetingLink: eventForm.meetingLink,
        startTime: Timestamp.fromDate(selectedDate.start),
        endTime: Timestamp.fromDate(selectedDate.end),
        participantIds: [user.uid, applicantId].filter(Boolean),
        participantNames: [user.email, applicantName].filter(Boolean),
        jobId: jobId || null,
        jobTitle: jobTitle || null,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        status: "scheduled",
      };

      await addDoc(collection(db, "events"), eventData);

      // Create notification for applicant
      if (applicantId) {
        await addDoc(collection(db, "notifications"), {
          userId: applicantId,
          title: "Interview Scheduled",
          message: `You have an interview scheduled for ${moment(
            selectedDate.start
          ).format("MMMM Do YYYY, h:mm a")}`,
          type: "interview",
          link: "/messages",
          read: false,
          createdAt: Timestamp.now(),
        });
      }

      setShowEventDialog(false);
      setEventForm({
        title: "",
        description: "",
        type: "interview",
        location: "",
        meetingLink: "",
      });
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const exportToGoogleCalendar = () => {
    if (!selectedDate) return;

    const startTime = moment(selectedDate.start).format("YYYYMMDDTHHmmss");
    const endTime = moment(selectedDate.end).format("YYYYMMDDTHHmmss");
    const title = encodeURIComponent(eventForm.title);
    const description = encodeURIComponent(eventForm.description);
    const location = encodeURIComponent(eventForm.location);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=${location}`;

    window.open(googleCalendarUrl, "_blank");
  };

  const exportToICS = () => {
    if (!selectedDate) return;

    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${moment(selectedDate.start).format("YYYYMMDDTHHmmss")}`,
      `DTEND:${moment(selectedDate.end).format("YYYYMMDDTHHmmss")}`,
      `SUMMARY:${eventForm.title}`,
      `DESCRIPTION:${eventForm.description}`,
      `LOCATION:${eventForm.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([event], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "interview.ics";
    link.click();
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";

    switch (event.type) {
      case "interview":
        backgroundColor = "#f50057";
        break;
      case "meeting":
        backgroundColor = "#3f51b5";
        break;
      case "deadline":
        backgroundColor = "#ff9800";
        break;
      default:
        backgroundColor = "#3174ad";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Schedule Interview</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click on a time slot to schedule an interview. You can also drag to
            select a time range.
          </Alert>
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day", "agenda"]}
              defaultView="week"
              step={30}
              timeslots={2}
              style={{ height: "100%" }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EventIcon />
            Schedule Interview Details
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={eventForm.type}
                label="Type"
                onChange={(e) =>
                  setEventForm({ ...eventForm, type: e.target.value })
                }
              >
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Location"
              fullWidth
              value={eventForm.location}
              onChange={(e) =>
                setEventForm({ ...eventForm, location: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <LocationOn sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              placeholder="Enter physical location or 'Remote'"
            />

            <TextField
              label="Meeting Link"
              fullWidth
              value={eventForm.meetingLink}
              onChange={(e) =>
                setEventForm({ ...eventForm, meetingLink: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <VideoCall sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              placeholder="Zoom, Teams, or Google Meet link"
            />

            {selectedDate && (
              <Alert severity="info">
                <strong>Date & Time:</strong>
                <br />
                {moment(selectedDate.start).format(
                  "MMMM Do YYYY, h:mm a"
                )} - {moment(selectedDate.end).format("h:mm a")}
              </Alert>
            )}

            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={exportToGoogleCalendar}
                startIcon={<EventIcon />}
              >
                Add to Google Calendar
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={exportToICS}
                startIcon={<EventIcon />}
              >
                Export .ICS
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleScheduleInterview}
            disabled={!eventForm.title || !selectedDate}
          >
            Schedule Interview
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
