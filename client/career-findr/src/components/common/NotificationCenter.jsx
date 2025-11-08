import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  ListItemIcon,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Cancel,
  Info,
  Schedule,
  Email,
  Work,
  School,
  Person,
  DoneAll,
} from "@mui/icons-material";
import { useNotifications } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    handleClose();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: <CheckCircle fontSize="small" color="success" />,
      error: <Cancel fontSize="small" color="error" />,
      info: <Info fontSize="small" color="info" />,
      application: <School fontSize="small" color="primary" />,
      job: <Work fontSize="small" color="warning" />,
      message: <Email fontSize="small" color="info" />,
      interview: <Schedule fontSize="small" color="secondary" />,
      user: <Person fontSize="small" />,
    };
    return icons[type] || <Info fontSize="small" />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: "success.light",
      error: "error.light",
      info: "info.light",
      application: "primary.light",
      job: "warning.light",
      message: "info.light",
      interview: "secondary.light",
    };
    return colors[type] || "grey.100";
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
          },
        }}
      >
        <Box
          px={2}
          py={1.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={() => {
                markAllAsRead();
                handleClose();
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box py={4} textAlign="center">
            <NotificationsIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 1.5,
                px: 2,
                bgcolor: notification.read
                  ? "transparent"
                  : getNotificationColor(notification.type),
                "&:hover": {
                  bgcolor: notification.read
                    ? "action.hover"
                    : getNotificationColor(notification.type),
                },
              }}
            >
              <Box display="flex" gap={1.5} width="100%">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: notification.read
                      ? "grey.300"
                      : "background.paper",
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography
                    variant="body2"
                    fontWeight={notification.read ? 400 : 600}
                  >
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={0.5}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {notification.createdAt?.toDate
                        ? formatDistanceToNow(notification.createdAt.toDate(), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </Typography>
                    {!notification.read && (
                      <Chip
                        label="New"
                        size="small"
                        color="primary"
                        sx={{ height: 20 }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}

        <Divider />
        <Box p={1} textAlign="center">
          <Button
            size="small"
            fullWidth
            onClick={() => {
              navigate("/notifications");
              handleClose();
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
}
