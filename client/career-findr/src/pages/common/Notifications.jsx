import React, { useState } from "react";
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
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight={700}>
            Notifications
          </Typography>
          <Button
            startIcon={<DoneAll />}
            onClick={handleMarkAllRead}
            disabled={notifications.filter((n) => !n.read).length === 0}
          >
            Mark all as read
          </Button>
        </Box>

        <Card>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
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
                      sx={{ height: 20 }}
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
              <Box py={8} textAlign="center">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tabValue === 1
                    ? "You're all caught up!"
                    : "You have no notifications at this time."}
                </Typography>
              </Box>
            ) : (
              Object.entries(groupedNotifications).map(([group, notifs]) => (
                <Box key={group}>
                  <Box
                    px={2}
                    py={1}
                    bgcolor="grey.100"
                    borderTop={1}
                    borderColor="divider"
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {group}
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {notifs.map((notification) => (
                      <ListItem
                        key={notification.id}
                        button
                        onClick={() => handleNotificationClick(notification)}
                        sx={{
                          bgcolor: notification.read
                            ? "transparent"
                            : "action.hover",
                          borderLeft: 4,
                          borderColor: notification.read
                            ? "transparent"
                            : getNotificationColor(notification.type),
                          "&:hover": {
                            bgcolor: "action.selected",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: getNotificationColor(notification.type),
                              width: 48,
                              height: 48,
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              fontWeight={notification.read ? 400 : 600}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {notification.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mt={0.5}
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
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              ml: 2,
                            }}
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
