import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Event as EventIcon,
  VideoCall,
  LocationOn,
  People,
  Close,
  Delete,
  Edit,
  CalendarToday,
} from "@mui/icons-material";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

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
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        eventsData.push({
          id: docSnap.id,
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;

    try {
      await deleteDoc(doc(db, "events", selectedEvent.id));
      setShowEventDialog(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedEvent?.id) return;

    try {
      await updateDoc(doc(db, "events", selectedEvent.id), {
        status: newStatus,
      });
      setShowEventDialog(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const exportToGoogleCalendar = (event) => {
    const startTime = moment(event.start).format("YYYYMMDDTHHmmss");
    const endTime = moment(event.end).format("YYYYMMDDTHHmmss");
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=${location}`;

    window.open(googleCalendarUrl, "_blank");
  };

  const exportToICS = (event) => {
    const icsEvent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${moment(event.start).format("YYYYMMDDTHHmmss")}`,
      `DTEND:${moment(event.end).format("YYYYMMDDTHHmmss")}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ""}`,
      `LOCATION:${event.location || ""}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsEvent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
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

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "rescheduled":
        return "warning";
      default:
        return "default";
    }
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight={700}>
            My Calendar
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              icon={<EventIcon />}
              label={`${events.length} Events`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        <div className="row g-3">
          {/* Upcoming Events */}
          <div className="col-12 col-lg-3">
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Upcoming Events
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {upcomingEvents.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    py={2}
                  >
                    No upcoming events
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {upcomingEvents.map((event) => (
                      <ListItem
                        key={event.id}
                        button
                        onClick={() => handleSelectEvent(event)}
                        sx={{ borderRadius: 1, mb: 1 }}
                      >
                        <ListItemIcon>
                          <EventIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={moment(event.start).format(
                            "MMM D, h:mm a"
                          )}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 600,
                          }}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Event Types
                </Typography>
                <Box display="flex" flexDirection="column" gap={1} mt={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "#f50057",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="caption">Interview</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "#3f51b5",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="caption">Meeting</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "#ff9800",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="caption">Deadline</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: "#3174ad",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="caption">Other</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="col-12 col-lg-9">
            <Card>
              <CardContent>
                <Box sx={{ height: 700 }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    views={["month", "week", "day", "agenda"]}
                    defaultView="month"
                    style={{ height: "100%" }}
                  />
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>

      {/* Event Details Dialog */}
      <Dialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventIcon />
              Event Details
            </Box>
            <IconButton onClick={() => setShowEventDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedEvent.title}
                </Typography>
                <Chip
                  label={selectedEvent.type || "other"}
                  size="small"
                  color="primary"
                  sx={{ textTransform: "capitalize" }}
                />
                {selectedEvent.status && (
                  <Chip
                    label={selectedEvent.status}
                    size="small"
                    color={getStatusColor(selectedEvent.status)}
                    sx={{ ml: 1, textTransform: "capitalize" }}
                  />
                )}
              </Box>

              <Divider />

              <Box display="flex" alignItems="center" gap={1}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2">
                  {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")} -{" "}
                  {moment(selectedEvent.end).format("h:mm a")}
                </Typography>
              </Box>

              {selectedEvent.description && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.description}
                  </Typography>
                </Box>
              )}

              {selectedEvent.location && (
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">
                    {selectedEvent.location}
                  </Typography>
                </Box>
              )}

              {selectedEvent.meetingLink && (
                <Box display="flex" alignItems="center" gap={1}>
                  <VideoCall fontSize="small" color="action" />
                  <Button
                    size="small"
                    href={selectedEvent.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Meeting
                  </Button>
                </Box>
              )}

              {selectedEvent.participantNames &&
                selectedEvent.participantNames.length > 0 && (
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <People fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Participants
                      </Typography>
                    </Box>
                    {selectedEvent.participantNames.map((name, index) => (
                      <Chip
                        key={index}
                        label={name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}

              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => exportToGoogleCalendar(selectedEvent)}
                  fullWidth
                >
                  Add to Google Calendar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => exportToICS(selectedEvent)}
                  fullWidth
                >
                  Export .ICS
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedEvent?.createdBy === user?.uid && (
            <>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={handleDeleteEvent}
              >
                Delete
              </Button>
              <Box flexGrow={1} />
            </>
          )}
          {selectedEvent?.status === "scheduled" && (
            <>
              <Button onClick={() => handleUpdateStatus("completed")}>
                Mark Completed
              </Button>
              <Button
                onClick={() => handleUpdateStatus("cancelled")}
                color="error"
              >
                Cancel Event
              </Button>
            </>
          )}
          <Button onClick={() => setShowEventDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
