import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import {
  SearchOutlined,
  MoreVert,
  VisibilityOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  EmailOutlined,
  SchoolOutlined,
  PersonOutlined,
  AttachFileOutlined,
  DownloadOutlined,
  PhoneOutlined,
  CalendarTodayOutlined,
  AssignmentOutlined,
  PendingActionsOutlined,
  HourglassEmptyOutlined,
  ThumbUpOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getInstitutionApplications,
  updateApplicationStatus,
} from "../../services/applicationService";
import { formatDate } from "../../utils/dateUtils";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

export default function ApplicationReview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    data: null,
  });

  const STATUS_CONFIG = {
    pending: { label: "Pending", color: "warning" },
    "under review": { label: "Under Review", color: "info" },
    approved: { label: "Accepted", color: "success" },
    rejected: { label: "Rejected", color: "error" },
  };
  const statusFilters = ["all", ...Object.keys(STATUS_CONFIG)];
  const currentStatus = statusFilters[currentTab];

  // Fetch applications
  const {
    data: applicationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["instituteApplications", currentStatus],
    queryFn: () =>
      getInstitutionApplications(user.uid, {
        status: currentStatus === "all" ? "" : currentStatus,
      }),
  });

  const applications = applicationsData || [];

  // Filter by search query on client side
  const normalizeStatus = (status) =>
    (status || "").toString().trim().toLowerCase();

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      app.studentName?.toLowerCase().includes(search) ||
      app.studentEmail?.toLowerCase().includes(search) ||
      app.courseName?.toLowerCase().includes(search)
    );
  });

  // Statistics
  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(
      (a) => normalizeStatus(a.status) === "pending"
    ).length,
    underReview: filteredApplications.filter(
      (a) => normalizeStatus(a.status) === "under review"
    ).length,
    accepted: filteredApplications.filter(
      (a) => normalizeStatus(a.status) === "approved"
    ).length,
    rejected: filteredApplications.filter(
      (a) => normalizeStatus(a.status) === "rejected"
    ).length,
  };

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status, reason }) =>
      updateApplicationStatus(applicationId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["instituteApplications"]);
      setConfirmDialog({ open: false, type: "", data: null });
      setAnchorEl(null);
      setErrorMessage("");
    },
    onError: (error) => {
      setConfirmDialog({ open: false, type: "", data: null });
      setErrorMessage(error.message || "Failed to update application status");
    },
  });

  const handleMenuOpen = (event, application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (status) => {
    setConfirmDialog({
      open: true,
      type: status,
      data: selectedApplication,
    });
    handleMenuClose();
  };

  const handleConfirmStatusChange = () => {
    if (confirmDialog.data) {
      updateStatusMutation.mutate({
        applicationId: confirmDialog.data.id,
        status: confirmDialog.type,
      });
    }
  };

  const handleDownloadDocument = (documentUrl, documentName) => {
    // Trigger document download
    window.open(documentUrl, "_blank");
  };

  const getStatusMeta = (status) => {
    const normalized = normalizeStatus(status);
    return (
      STATUS_CONFIG[normalized] || {
        label: status || "Unknown",
        color: "default",
      }
    );
  };

  // Helper to get student name from application
  const getStudentName = (app) => {
    if (app.studentName) return app.studentName;
    if (app.firstName && app.lastName) return `${app.firstName} ${app.lastName}`;
    if (app.firstName) return app.firstName;
    return "Unknown Student";
  };

  // Helper to get student email
  const getStudentEmail = (app) => {
    return app.studentEmail || app.email || "";
  };

  if (isLoading) {
    return <LoadingScreen message="Loading applications..." />;
  }

  return (
    <Fade in timeout={FADE_DURATION}>
      <Box className="min-vh-100" bgcolor="background.default">
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header with Gradient */}
          <Zoom in timeout={ZOOM_DURATION}>
            <Card
              sx={{
                mb: 4,
                background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
              }}
            >
              <CardContent sx={{ py: 3, px: 4 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      p: 1.5,
                      display: "flex",
                    }}
                  >
                    <AssignmentOutlined sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Application Review
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Review and manage student applications to your courses
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Zoom>

          {/* Statistics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-lg-2">
              <Grow in timeout={600} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "primary.100",
                          color: "primary.main",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <AssignmentOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Total
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.total}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <Grow in timeout={700} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    borderTop: 3,
                    borderColor: "warning.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "warning.100",
                          color: "warning.main",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <PendingActionsOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Pending
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {stats.pending}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <Grow in timeout={800} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    borderTop: 3,
                    borderColor: "info.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "info.100",
                          color: "info.main",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <HourglassEmptyOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Under Review
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="info.main"
                        >
                          {stats.underReview}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <Grow in timeout={900} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    borderTop: 3,
                    borderColor: "success.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "success.100",
                          color: "success.main",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <ThumbUpOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Accepted
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="success.main"
                        >
                          {stats.accepted}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <Grow in timeout={1000} style={{ transformOrigin: "0 0 0" }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    borderTop: 3,
                    borderColor: "error.main",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          bgcolor: "error.100",
                          color: "error.main",
                          borderRadius: 2,
                          p: 1,
                          display: "flex",
                        }}
                      >
                        <ThumbDownOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Rejected
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="error.main"
                        >
                          {stats.rejected}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </div>
          </div>

          {/* Search and Tabs */}
          <Grow in timeout={1100} style={{ transformOrigin: "0 0 0" }}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Search */}
                <TextField
                  fullWidth
                  placeholder="Search by student name, course, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                      },
                    },
                  }}
                />

                {/* Tabs */}
                <Tabs
                  value={currentTab}
                  onChange={(e, newValue) => setCurrentTab(newValue)}
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  {statusFilters.map((statusKey) => (
                    <Tab
                      key={statusKey}
                      label={
                        statusKey === "all"
                          ? "All"
                          : STATUS_CONFIG[statusKey]?.label || statusKey
                      }
                    />
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </Grow>

          {/* Error State */}
          {error && (
            <Grow in timeout={300}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error.response?.data?.message || "Failed to load applications"}
              </Alert>
            </Grow>
          )}

          {/* Mutation Error Alert */}
          {errorMessage && (
            <Grow in timeout={300}>
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setErrorMessage("")}
              >
                {errorMessage}
              </Alert>
            </Grow>
          )}

          {/* Applications Table */}
          <Grow in timeout={1200} style={{ transformOrigin: "0 0 0" }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Applied Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Previous Qualification
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Box
                            sx={{
                              bgcolor: "primary.50",
                              borderRadius: "50%",
                              width: 80,
                              height: 80,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 2,
                            }}
                          >
                            <SchoolOutlined
                              sx={{ fontSize: 40, color: "primary.main" }}
                            />
                          </Box>
                          <Typography variant="body1" color="text.secondary">
                            No applications found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application, index) => (
                        <TableRow
                          key={application.id}
                          hover
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": { bgcolor: "primary.50" },
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: "primary.main",
                                  fontWeight: 600,
                                }}
                              >
                                {getStudentName(application).charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {getStudentName(application)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {getStudentEmail(application)}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {application.courseName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {application.courseField || application.courseCode}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(application.createdAt || application.appliedDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusMeta(application.status).label}
                              size="small"
                              color={getStatusMeta(application.status).color}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {application.previousQualification || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, application)}
                              sx={{
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: "primary.100",
                                  color: "primary.main",
                                },
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grow>

          {/* Context Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                minWidth: 200,
              },
            }}
          >
            <MenuItem
              onClick={() => handleViewDetails(selectedApplication)}
              sx={{ gap: 1.5, py: 1.5 }}
            >
              <ListItemIcon>
                <VisibilityOutlined fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            {normalizeStatus(selectedApplication?.status) !==
              "under review" && (
              <MenuItem
                onClick={() => handleStatusChange("under review")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <EmailOutlined fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText>Mark Under Review</ListItemText>
              </MenuItem>
            )}
            {normalizeStatus(selectedApplication?.status) !== "approved" && (
              <MenuItem
                onClick={() => handleStatusChange("approved")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <CheckCircleOutlined fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Accept Application</ListItemText>
              </MenuItem>
            )}
            {normalizeStatus(selectedApplication?.status) !== "rejected" && (
              <MenuItem
                onClick={() => handleStatusChange("rejected")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <CancelOutlined fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Reject Application</ListItemText>
              </MenuItem>
            )}
          </Menu>

          {/* View Details Dialog */}
          <Dialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              },
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Application Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {selectedApplication && (
                <Box>
                  {/* Student Information */}
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <PersonOutlined />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Student Information
                    </Typography>
                  </Box>
                  <List
                    dense
                    sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 3 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <PersonOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Name"
                        secondary={getStudentName(selectedApplication)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={getStudentEmail(selectedApplication)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedApplication.phone || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Date of Birth"
                        secondary={formatDate(selectedApplication.dateOfBirth) || "N/A"}
                      />
                    </ListItem>
                  </List>

                  {/* Educational Background */}
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "secondary.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <SchoolOutlined />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Educational Background
                    </Typography>
                  </Box>
                  <List
                    dense
                    sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 3 }}
                  >
                    <ListItem>
                      <ListItemText
                        primary="High School"
                        secondary={selectedApplication.highSchool || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Graduation Year"
                        secondary={selectedApplication.graduationYear || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Previous Qualification"
                        secondary={selectedApplication.previousQualification || "N/A"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Grades"
                        secondary={selectedApplication.grades || "N/A"}
                      />
                    </ListItem>
                  </List>

                  {/* Personal Statement */}
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "info.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <AssignmentOutlined />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Personal Statement
                    </Typography>
                  </Box>
                  <Box
                    sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2, mb: 3 }}
                  >
                    <Typography variant="body2" paragraph>
                      <strong>Motivation:</strong>
                      <br />
                      {selectedApplication.motivation || "Not provided"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Career Goals:</strong>
                      <br />
                      {selectedApplication.careerGoals || "Not provided"}
                    </Typography>
                  </Box>

                  {/* Documents */}
                  <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Box
                      sx={{
                        bgcolor: "success.main",
                        color: "white",
                        borderRadius: 2,
                        p: 1,
                        display: "flex",
                      }}
                    >
                      <AttachFileOutlined />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Documents
                    </Typography>
                  </Box>
                  <List dense sx={{ bgcolor: "grey.50", borderRadius: 2 }}>
                    {selectedApplication.documents?.transcript && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachFileOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Academic Transcript" />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedApplication.documents.transcript,
                              "transcript"
                            )
                          }
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "primary.100",
                              color: "primary.main",
                            },
                          }}
                        >
                          <DownloadOutlined />
                        </IconButton>
                      </ListItem>
                    )}
                    {selectedApplication.documents?.idCopy && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachFileOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="ID Copy" />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedApplication.documents.idCopy,
                              "id"
                            )
                          }
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "primary.100",
                              color: "primary.main",
                            },
                          }}
                        >
                          <DownloadOutlined />
                        </IconButton>
                      </ListItem>
                    )}
                    {selectedApplication.documents?.certificate && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachFileOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Certificates" />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedApplication.documents.certificate,
                              "certificate"
                            )
                          }
                          sx={{
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "primary.100",
                              color: "primary.main",
                            },
                          }}
                        >
                          <DownloadOutlined />
                        </IconButton>
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Close
              </Button>
              {normalizeStatus(selectedApplication?.status) === "pending" && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleStatusChange("rejected");
                    }}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleStatusChange("approved");
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  >
                    Accept
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>

          {/* Confirm Status Change Dialog */}
          <ConfirmDialog
            open={confirmDialog.open}
            title={`${
              confirmDialog.type ? getStatusMeta(confirmDialog.type).label : ""
            } Application`}
            message={`Are you sure you want to ${
              getStatusMeta(confirmDialog.type).label?.toLowerCase() || "update"
            } this application from ${
              confirmDialog.data?.studentName || "this student"
            }?`}
            onConfirm={handleConfirmStatusChange}
            onCancel={() =>
              setConfirmDialog({ open: false, type: "", data: null })
            }
            loading={updateStatusMutation.isPending}
          />
        </Container>
      </Box>
    </Fade>
  );
}
