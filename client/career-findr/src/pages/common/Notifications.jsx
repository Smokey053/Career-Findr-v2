import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Info,
  Work,
  School,
  Message,
  Event,
  Person,
  Delete,
  DoneAll,
  NotificationsActive,
  ArrowBackIosNew,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type) => {
  const iconMap = {
    success: <CheckCircle />,
    error: <Error />,
    info: <Info />,
    application: <Work />,
    job: <Work />,
    message: <Message />,
    interview: <Event />,
    user: <Person />,
    course: <School />,
  };
  return iconMap[type] || <Info />;
};

const getNotificationColor = (type) => {
  const colorMap = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
    application: "#ff9800",
    job: "#9c27b0",
    message: "#00bcd4",
    interview: "#ff5722",
    user: "#607d8b",
    course: "#3f51b5",
  };
  return colorMap[type] || "#757575";
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, loading } =
    useNotifications();
  const [tabValue, setTabValue] = useState(0);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Click-away listener to go back
  useEffect(() => {
    const handleClickOutside = (e) => {
      const container = document.getElementById("notifications-container");
      if (container && !container.contains(e.target)) {
        handleBack();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleBack]);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return !notif.read; // Unread
    if (tabValue === 2) return notif.read; // Read
    return true;
  });

  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const date = notif.createdAt?.toDate?.();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let group = "Older";
    if (date) {
      if (date.toDateString() === today.toDateString()) {
        group = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = "Yesterday";
      } else if ((today - date) / (1000 * 60 * 60 * 24) < 7) {
        group = "This Week";
      }
    }

    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  return (
    <Fade in timeout={800}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container id="notifications-container" maxWidth="lg" sx={{ py: 4 }}>
          {/* Animated Header */}
          <Zoom in timeout={600}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                borderRadius: 4,
                p: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  borderRadius: "0 0 0 100%",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={handleBack}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.15)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  }}
                >
                  <ArrowBackIosNew />
                </IconButton>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <NotificationsActive sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  Notifications
                </Typography>
              </Box>
              <Button
                startIcon={<DoneAll />}
                onClick={handleMarkAllRead}
                disabled={notifications.filter((n) => !n.read).length === 0}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              >
                Mark all as read
              </Button>
            </Box>
          </Zoom>

          <Grow in timeout={800} style={{ transformOrigin: "top center" }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 2,
                  bgcolor: "grey.50",
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: 56,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                  },
                }}
              >
                <Tab label={`All (${notifications.length})`} />
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      Unread
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <Chip
                          label={notifications.filter((n) => !n.read).length}
                          size="small"
                          color="primary"
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            "& .MuiChip-label": { px: 1.5 },
                          }}
                        />
                      )}
                    </Box>
                  }
                />
                <Tab
                  label={`Read (${notifications.filter((n) => n.read).length})`}
                />
              </Tabs>

              <CardContent sx={{ p: 0 }}>
                {filteredNotifications.length === 0 ? (
                  <Zoom in timeout={600}>
                    <Box py={8} textAlign="center">
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <NotificationsActive
                          sx={{ fontSize: 40, color: "text.secondary" }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        fontWeight={600}
                        gutterBottom
                      >
                        No notifications
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tabValue === 1
                          ? "You're all caught up!"
                          : "You have no notifications at this time."}
                      </Typography>
                    </Box>
                  </Zoom>
                ) : (
                  Object.entries(groupedNotifications).map(
                    ([group, notifs], groupIndex) => (
                      <Box key={group}>
                        <Box
                          px={2}
                          py={1.5}
                          bgcolor="grey.100"
                          borderTop={groupIndex > 0 ? 1 : 0}
                          borderColor="divider"
                        >
                          <Typography
                            variant="caption"
                            fontWeight={700}
                            color="text.secondary"
                            textTransform="uppercase"
                            letterSpacing={0.5}
                          >
                            {group}
                          </Typography>
                        </Box>
                        <List sx={{ p: 0 }}>
                          {notifs.map((notification, index) => (
                            <Fade
                              key={notification.id}
                              in
                              timeout={500}
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <ListItem
                                button
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                                sx={{
                                  bgcolor: notification.read
                                    ? "transparent"
                                    : "rgba(37, 99, 235, 0.05)",
                                  borderLeft: 4,
                                  borderColor: notification.read
                                    ? "transparent"
                                    : getNotificationColor(notification.type),
                                  transition:
                                    "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    bgcolor: "action.selected",
                                    transform: "translateX(4px)",
                                  },
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: getNotificationColor(
                                        notification.type
                                      ),
                                      width: 48,
                                      height: 48,
                                      boxShadow: `0 4px 12px ${getNotificationColor(
                                        notification.type
                                      )}40`,
                                      transition: "transform 0.3s ease",
                                      "&:hover": {
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    {getNotificationIcon(notification.type)}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={notification.read ? 500 : 700}
                                    >
                                      {notification.title}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1.6 }}
                                      >
                                        {notification.message}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        mt={0.5}
                                        fontWeight={500}
                                      >
                                        {notification.createdAt?.toDate
                                          ? formatDistanceToNow(
                                              notification.createdAt.toDate(),
                                              {
                                                addSuffix: true,
                                              }
                                            )
                                          : ""}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                {!notification.read && (
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                      bgcolor: "primary.main",
                                      ml: 2,
                                      boxShadow:
                                        "0 2px 8px rgba(37, 99, 235, 0.4)",
                                      animation: "pulse 2s infinite",
                                      "@keyframes pulse": {
                                        "0%": {
                                          transform: "scale(1)",
                                          opacity: 1,
                                        },
                                        "50%": {
                                          transform: "scale(1.2)",
                                          opacity: 0.7,
                                        },
                                        "100%": {
                                          transform: "scale(1)",
                                          opacity: 1,
                                        },
                                      },
                                    }}
                                  />
                                )}
                              </ListItem>
                            </Fade>
                          ))}
                        </List>
                      </Box>
                    )
                  )
                )}
              </CardContent>
            </Card>
          </Grow>
        </Container>
      </Box>
    </Fade>
  );
}
