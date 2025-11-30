import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fade,
  Zoom,
  Grow,
  Tooltip,
} from "@mui/material";
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  CampaignRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  NotificationsActiveRounded,
  InfoRounded,
  WarningRounded,
  CheckCircleRounded,
  ErrorRounded,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
} from "../../services/announcementService";
import { formatDistanceToNow } from "date-fns";

export default function AnnouncementManagement() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    targetAudience: "all",
  });
  const [error, setError] = useState("");

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });

  // Add announcement mutation
  const addMutation = useMutation({
    mutationFn: (announcementData) => addAnnouncement(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to add announcement");
    },
  });

  // Update announcement mutation
  const updateMutation = useMutation({
    mutationFn: ({ announcementId, announcementData }) =>
      updateAnnouncement(announcementId, announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      handleCloseDialog();
    },
    onError: (error) => {
      setError(error.message || "Failed to update announcement");
    },
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: (announcementId) => deleteAnnouncement(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
      setDeleteDialogOpen(false);
      setSelectedAnnouncement(null);
    },
    onError: (error) => {
      setError(error.message || "Failed to delete announcement");
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ announcementId, isActive }) =>
      toggleAnnouncementStatus(announcementId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(["announcements"]);
    },
  });

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title || "",
        message: announcement.message || "",
        type: announcement.type || "info",
        targetAudience: announcement.targetAudience || "all",
      });
    } else {
      setSelectedAnnouncement(null);
      setFormData({
        title: "",
        message: "",
        type: "info",
        targetAudience: "all",
      });
    }
    setError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAnnouncement(null);
    setFormData({
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
    });
    setError("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return;
    }

    const announcementData = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      type: formData.type,
      targetAudience: formData.targetAudience,
      isActive: true,
    };

    if (selectedAnnouncement) {
      updateMutation.mutate({
        announcementId: selectedAnnouncement.id,
        announcementData,
      });
    } else {
      addMutation.mutate(announcementData);
    }
  };

  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAnnouncement) {
      deleteMutation.mutate(selectedAnnouncement.id);
    }
  };

  const handleToggleStatus = (announcement) => {
    toggleMutation.mutate({
      announcementId: announcement.id,
      isActive: !announcement.isActive,
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      info: "info",
      warning: "warning",
      success: "success",
      error: "error",
    };
    return colors[type] || "default";
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: <InfoRounded fontSize="small" />,
      warning: <WarningRounded fontSize="small" />,
      success: <CheckCircleRounded fontSize="small" />,
      error: <ErrorRounded fontSize="small" />,
    };
    return icons[type] || <InfoRounded fontSize="small" />;
  };

  if (isLoading) {
    return <LoadingScreen message="Loading announcements..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Gradient */}
      <Fade in timeout={800}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
            borderRadius: 4,
            p: 4,
            color: "white",
            position: "relative",
            overflow: "hidden",
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
          <Box position="relative" zIndex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <NotificationsActiveRounded sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight={700}>
                Announcements Management
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Create and manage platform-wide announcements
            </Typography>
          </Box>
          <Zoom in timeout={600}>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "white",
                color: "#8B5CF6",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1.5,
                position: "relative",
                zIndex: 1,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.95)",
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              New Announcement
            </Button>
          </Zoom>
        </Box>
      </Fade>

      {announcements.length === 0 ? (
        <Zoom in timeout={800}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <CampaignRounded
                sx={{
                  fontSize: 100,
                  color: "text.disabled",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                fontWeight={600}
              >
                No Announcements Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first announcement to notify users
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                onClick={() => handleOpenDialog()}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                New Announcement
              </Button>
            </CardContent>
          </Card>
        </Zoom>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {announcements.map((announcement, index) => (
            <Grow
              key={announcement.id}
              in
              timeout={800}
              style={{
                transformOrigin: "0 0",
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderLeft: 4,
                  borderColor: `${getTypeColor(announcement.type)}.main`,
                  "&:hover": {
                    transform: "translateX(8px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {announcement.title}
                        </Typography>
                        <Chip
                          icon={getTypeIcon(announcement.type)}
                          label={announcement.type}
                          color={getTypeColor(announcement.type)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={announcement.targetAudience}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                        {announcement.isActive ? (
                          <Chip
                            label="Active"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        ) : (
                          <Chip
                            label="Inactive"
                            color="default"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ mb: 2, color: "text.secondary", lineHeight: 1.7 }}
                      >
                        {announcement.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {announcement.createdAt &&
                          `Posted ${formatDistanceToNow(
                            announcement.createdAt.toDate()
                          )} ago`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                      <Tooltip
                        title={
                          announcement.isActive
                            ? "Hide Announcement"
                            : "Show Announcement"
                        }
                        arrow
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(announcement)}
                          color={announcement.isActive ? "primary" : "default"}
                          sx={{
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                        >
                          {announcement.isActive ? (
                            <VisibilityRounded />
                          ) : (
                            <VisibilityOffRounded />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(announcement)}
                          sx={{
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              transform: "scale(1.15)",
                              color: "primary.main",
                            },
                          }}
                        >
                          <EditRounded />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(announcement)}
                          sx={{
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": { transform: "scale(1.15)" },
                          }}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {selectedAnnouncement ? "Edit Announcement" : "New Announcement"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Zoom in>
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            </Zoom>
          )}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}
          >
            <TextField
              fullWidth
              label="Title *"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-focused": {
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Message *"
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&.Mui-focused": {
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleInputChange("type", e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="info">
                  <Box display="flex" alignItems="center" gap={1}>
                    <InfoRounded color="info" fontSize="small" />
                    Info
                  </Box>
                </MenuItem>
                <MenuItem value="warning">
                  <Box display="flex" alignItems="center" gap={1}>
                    <WarningRounded color="warning" fontSize="small" />
                    Warning
                  </Box>
                </MenuItem>
                <MenuItem value="success">
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleRounded color="success" fontSize="small" />
                    Success
                  </Box>
                </MenuItem>
                <MenuItem value="error">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ErrorRounded color="error" fontSize="small" />
                    Error
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={formData.targetAudience}
                label="Target Audience"
                onChange={(e) =>
                  handleInputChange("targetAudience", e.target.value)
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="student">Students Only</MenuItem>
                <MenuItem value="institute">Institutions Only</MenuItem>
                <MenuItem value="company">Companies Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 2, px: 3 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={addMutation.isPending || updateMutation.isPending}
            sx={{
              borderRadius: 2,
              px: 3,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            {addMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : selectedAnnouncement
              ? "Update"
              : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${selectedAnnouncement?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedAnnouncement(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  );
}
