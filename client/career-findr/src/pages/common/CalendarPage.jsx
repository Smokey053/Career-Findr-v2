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
  Fade,
  Zoom,
  Grow,
  Slide,
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
  CalendarMonth,
  Schedule,
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

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsData = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Handle potential missing or invalid dates
          const startTime =
            data.startTime?.toDate?.() || data.start?.toDate?.() || new Date();
          const endTime =
            data.endTime?.toDate?.() || data.end?.toDate?.() || new Date();
          eventsData.push({
            id: docSnap.id,
            title: data.title || "Untitled Event",
            start: startTime,
            end: endTime,
            ...data,
          });
        });
        setEvents(eventsData);
      },
      (error) => {
        console.error("Error fetching events:", error);
        // If there's an error, just set empty events
        setEvents([]);
      }
    );

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
    <Fade in timeout={600}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Animated Header */}
          <Zoom in timeout={500}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                borderRadius: 4,
                p: 4,
                mb: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: "30%",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CalendarMonth sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        My Calendar
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, mt: 0.5 }}
                      >
                        Manage your interviews, meetings, and deadlines
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={<EventIcon sx={{ color: "white !important" }} />}
                    label={`${events.length} Events`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Zoom>

          <div className="row g-3">
            {/* Upcoming Events */}
            <div className="col-12 col-lg-3">
              <Slide direction="right" in timeout={600}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Schedule color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Upcoming Events
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {upcomingEvents.length === 0 ? (
                      <Fade in timeout={500}>
                        <Box py={4} textAlign="center">
                          <EventIcon
                            sx={{ fontSize: 48, color: "grey.300", mb: 2 }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            No upcoming events
                          </Typography>
                        </Box>
                      </Fade>
                    ) : (
                      <List dense disablePadding>
                        {upcomingEvents.map((event, index) => (
                          <Grow in timeout={300 + index * 100} key={event.id}>
                            <ListItem
                              button
                              onClick={() => handleSelectEvent(event)}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: "rgba(37,99,235,0.04)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: "rgba(37,99,235,0.1)",
                                  transform: "translateX(4px)",
                                },
                              }}
                            >
                              <ListItemIcon>
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    background:
                                      "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <EventIcon
                                    fontSize="small"
                                    sx={{ color: "white" }}
                                  />
                                </Box>
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
                                secondaryTypographyProps={{
                                  variant: "caption",
                                }}
                              />
                            </ListItem>
                          </Grow>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Slide>

              {/* Legend */}
              <Slide direction="right" in timeout={700}>
                <Card
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Event Types
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5} mt={2}>
                      {[
                        { color: "#f50057", label: "Interview" },
                        { color: "#3f51b5", label: "Meeting" },
                        { color: "#ff9800", label: "Deadline" },
                        { color: "#3174ad", label: "Other" },
                      ].map((item, index) => (
                        <Fade in timeout={400 + index * 100} key={item.label}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: "grey.100",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: item.color,
                                borderRadius: 1,
                                boxShadow: `0 2px 6px ${item.color}40`,
                              }}
                            />
                            <Typography variant="body2" fontWeight={500}>
                              {item.label}
                            </Typography>
                          </Box>
                        </Fade>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </div>

            {/* Calendar */}
            <div className="col-12 col-lg-9">
              <Grow in timeout={700}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        height: 700,
                        "& .rbc-calendar": {
                          fontFamily: "inherit",
                        },
                        "& .rbc-header": {
                          padding: "12px 8px",
                          fontWeight: 600,
                          background:
                            "linear-gradient(180deg, rgba(37,99,235,0.05) 0%, transparent 100%)",
                        },
                        "& .rbc-today": {
                          bgcolor: "rgba(37,99,235,0.08)",
                        },
                        "& .rbc-selected": {
                          bgcolor: "primary.main !important",
                        },
                        "& .rbc-toolbar button": {
                          borderRadius: "8px !important",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "rgba(37,99,235,0.1) !important",
                          },
                          "&.rbc-active": {
                            background:
                              "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%) !important",
                            color: "white !important",
                          },
                        },
                        "& .rbc-event": {
                          borderRadius: "8px !important",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          },
                        },
                        "& .rbc-month-view": {
                          borderRadius: 2,
                          overflow: "hidden",
                        },
                      }}
                    >
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
              </Grow>
            </div>
          </div>
        </Container>

        {/* Event Details Dialog */}
        <Dialog
          open={showEventDialog}
          onClose={() => setShowEventDialog(false)}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Zoom}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
              color: "white",
              py: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <EventIcon />
                <Typography variant="h6" fontWeight={600}>
                  Event Details
                </Typography>
              </Box>
              <IconButton
                onClick={() => setShowEventDialog(false)}
                size="small"
                sx={{ color: "white" }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedEvent && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {selectedEvent.title}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={selectedEvent.type || "other"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        background:
                          "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                    {selectedEvent.status && (
                      <Chip
                        label={selectedEvent.status}
                        size="small"
                        color={getStatusColor(selectedEvent.status)}
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider />

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    p: 1.5,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <CalendarToday fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight={500}>
                    {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}{" "}
                    - {moment(selectedEvent.end).format("h:mm a")}
                  </Typography>
                </Box>

                {selectedEvent.description && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEvent.description}
                    </Typography>
                  </Box>
                )}

                {selectedEvent.location && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    sx={{ p: 1.5, bgcolor: "grey.50", borderRadius: 2 }}
                  >
                    <LocationOn fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEvent.location}
                    </Typography>
                  </Box>
                )}

                {selectedEvent.meetingLink && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <VideoCall fontSize="small" color="primary" />
                    <Button
                      size="small"
                      href={selectedEvent.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Join Meeting
                    </Button>
                  </Box>
                )}

                {selectedEvent.participantNames &&
                  selectedEvent.participantNames.length > 0 && (
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <People fontSize="small" color="primary" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Participants
                        </Typography>
                      </Box>
                      {selectedEvent.participantNames.map((name, index) => (
                        <Chip
                          key={index}
                          label={name}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            fontWeight: 500,
                          }}
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
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Add to Google Calendar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => exportToICS(selectedEvent)}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Export .ICS
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            {selectedEvent?.createdBy === user?.uid && (
              <>
                <Button
                  startIcon={<Delete />}
                  color="error"
                  onClick={handleDeleteEvent}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Delete
                </Button>
                <Box flexGrow={1} />
              </>
            )}
            {selectedEvent?.status === "scheduled" && (
              <>
                <Button
                  onClick={() => handleUpdateStatus("completed")}
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Mark Completed
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("cancelled")}
                  color="error"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Cancel Event
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowEventDialog(false)}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
