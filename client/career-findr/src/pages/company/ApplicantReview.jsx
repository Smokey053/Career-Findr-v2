import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Rating,
  LinearProgress,
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
  StarOutlined,
  PersonOutlined,
  AttachFileOutlined,
  DownloadOutlined,
  PhoneOutlined,
  CalendarTodayOutlined,
  SchoolOutlined,
  WorkOutlineOutlined,
  ArrowBack,
  ThumbUpOutlined,
  AssignmentIndOutlined,
  PendingActionsOutlined,
  HourglassEmptyOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { formatDate } from "../../utils/dateUtils";
import CalendarScheduler from "../../components/common/CalendarScheduler";
import { useAuth } from "../../contexts/AuthContext";
import { getJob } from "../../services/jobService";
import {
  getCompanyJobApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

// Animation timing constants
const FADE_DURATION = 800;
const ZOOM_DURATION = 500;
const STAGGER_DELAY = 100;

export default function ApplicantReview() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    data: null,
  });

  const statusFilters = [
    "All",
    "Applied",
    "Shortlisted",
    "Interviewing",
    "Accepted",
    "Rejected",
  ];
  const currentStatus = statusFilters[currentTab];

  // Fetch job details
  const { data: jobData } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  // Fetch applicants
  const {
    data: applicantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobApplicants", jobId, currentStatus],
    queryFn: () =>
      getCompanyJobApplications(user.uid, {
        jobId,
        status: currentStatus === "All" ? "" : currentStatus,
      }),
  });

  const applicants = applicantsData || [];

  // Filter by search query on client side
  const filteredApplicants = applicants.filter((app) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      app.studentName?.toLowerCase().includes(search) ||
      app.studentEmail?.toLowerCase().includes(search)
    );
  });

  // Statistics
  const stats = {
    total: filteredApplicants.length,
    applied: filteredApplicants.filter((a) => a.status === "Applied").length,
    shortlisted: filteredApplicants.filter((a) => a.status === "Shortlisted")
      .length,
    interviewing: filteredApplicants.filter((a) => a.status === "Interviewing")
      .length,
    accepted: filteredApplicants.filter((a) => a.status === "Accepted").length,
    rejected: filteredApplicants.filter((a) => a.status === "Rejected").length,
  };

  // Update applicant status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicantId, status, notes }) =>
      updateApplicationStatus(applicantId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobApplicants"]);
      queryClient.invalidateQueries(["companyDashboard"]);
      setConfirmDialog({ open: false, type: "", data: null });
      setAnchorEl(null);
    },
  });

  const handleMenuOpen = (event, applicant) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplicant(applicant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (status) => {
    setConfirmDialog({
      open: true,
      type: status,
      data: selectedApplicant,
    });
    handleMenuClose();
  };

  const handleConfirmStatusChange = () => {
    if (confirmDialog.data) {
      updateStatusMutation.mutate({
        applicantId: confirmDialog.data.id,
        status: confirmDialog.type,
      });
    }
  };

  const handleDownloadDocument = (documentUrl, documentName) => {
    window.open(documentUrl, "_blank");
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: "default",
      Shortlisted: "info",
      Interviewing: "warning",
      Accepted: "success",
      Rejected: "error",
    };
    return colors[status] || "default";
  };

  const calculateMatchScore = (applicant) => {
    // Simple matching algorithm based on skills and experience
    let score = 0;
    const jobSkills = jobData?.skills || [];
    const applicantSkills = applicant.skills || [];

    // Skills match (60% weight)
    const matchingSkills = applicantSkills.filter((skill) =>
      jobSkills.some((js) => js.toLowerCase() === skill.toLowerCase())
    );
    score += (matchingSkills.length / Math.max(jobSkills.length, 1)) * 60;

    // Experience match (40% weight)
    if (jobData?.experienceLevel === applicant.experienceLevel) {
      score += 40;
    } else if (
      (jobData?.experienceLevel === "Mid Level" &&
        applicant.experienceLevel === "Senior Level") ||
      (jobData?.experienceLevel === "Senior Level" &&
        applicant.experienceLevel === "Mid Level")
    ) {
      score += 20;
    }

    return Math.round(score);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading applicants..." />;
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
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/company/jobs")}
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    Back to Jobs
                  </Button>
                  <Box flexGrow={1}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Applicant Review
                    </Typography>
                    {jobData && (
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {jobData.title} - {jobData.department}
                      </Typography>
                    )}
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
                        <AssignmentIndOutlined />
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
                    borderColor: "grey.400",
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
                          bgcolor: "grey.200",
                          color: "grey.600",
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
                          Applied
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.applied}
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
                        <ThumbUpOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Shortlisted
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="info.main"
                        >
                          {stats.shortlisted}
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
                        <HourglassEmptyOutlined />
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Interviewing
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="warning.main"
                        >
                          {stats.interviewing}
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
                        <CheckCircleOutlined />
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
              <Grow in timeout={1100} style={{ transformOrigin: "0 0 0" }}>
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
          <Grow in timeout={1200} style={{ transformOrigin: "0 0 0" }}>
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
                  placeholder="Search by applicant name, email, or skills..."
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
                  {statusFilters.map((status) => (
                    <Tab key={status} label={status} />
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </Grow>

          {/* Error State */}
          {error && (
            <Grow in timeout={300}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error.response?.data?.message || "Failed to load applicants"}
              </Alert>
            </Grow>
          )}

          {/* Applicants Table */}
          <Grow in timeout={1300} style={{ transformOrigin: "0 0 0" }}>
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
                      <TableCell sx={{ fontWeight: 600 }}>Applicant</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Match Score
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Applied Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Skills Match
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplicants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
                            <PersonOutlined
                              sx={{ fontSize: 40, color: "primary.main" }}
                            />
                          </Box>
                          <Typography variant="body1" color="text.secondary">
                            No applicants found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplicants.map((applicant, index) => {
                        const matchScore = calculateMatchScore(applicant);
                        const applicantName =
                          applicant.studentName ||
                          applicant.name ||
                          "Applicant";
                        return (
                          <TableRow
                            key={applicant.id}
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
                                  {applicantName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {applicantName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {applicant.studentEmail ||
                                      applicant.email ||
                                      "No email"}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box flexGrow={1} minWidth={60}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={matchScore}
                                    color={
                                      matchScore >= 70
                                        ? "success"
                                        : matchScore >= 40
                                        ? "warning"
                                        : "error"
                                    }
                                    sx={{ borderRadius: 2, height: 6 }}
                                  />
                                </Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {matchScore}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {applicant.experienceLevel}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(applicant.appliedDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={applicant.status}
                                size="small"
                                color={getStatusColor(applicant.status)}
                                sx={{ borderRadius: 2, fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box display="flex" gap={0.5} flexWrap="wrap">
                                {applicant.skills
                                  ?.slice(0, 2)
                                  .map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
                                {applicant.skills?.length > 2 && (
                                  <Chip
                                    label={`+${applicant.skills.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, applicant)}
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
                        );
                      })
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
              onClick={() => handleViewDetails(selectedApplicant)}
              sx={{ gap: 1.5, py: 1.5 }}
            >
              <ListItemIcon>
                <VisibilityOutlined fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>View Profile</ListItemText>
            </MenuItem>
            {selectedApplicant?.status !== "Shortlisted" && (
              <MenuItem
                onClick={() => handleStatusChange("Shortlisted")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <ThumbUpOutlined fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText>Shortlist</ListItemText>
              </MenuItem>
            )}
            {selectedApplicant?.status !== "Interviewing" && (
              <MenuItem
                onClick={() => {
                  setCalendarOpen(true);
                  handleMenuClose();
                }}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <CalendarTodayOutlined fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText>Schedule Interview</ListItemText>
              </MenuItem>
            )}
            {selectedApplicant?.status !== "Accepted" && (
              <MenuItem
                onClick={() => handleStatusChange("Accepted")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <CheckCircleOutlined fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Accept</ListItemText>
              </MenuItem>
            )}
            {selectedApplicant?.status !== "Rejected" && (
              <MenuItem
                onClick={() => handleStatusChange("Rejected")}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <CancelOutlined fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Reject</ListItemText>
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
                Applicant Profile
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {selectedApplicant && (
                <Box>
                  {/* Match Score */}
                  <Card
                    sx={{
                      mb: 3,
                      background:
                        "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight={600}
                      >
                        Match Score
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Rating
                          value={calculateMatchScore(selectedApplicant) / 20}
                          readOnly
                          precision={0.5}
                          icon={<StarOutlined sx={{ color: "#F59E0B" }} />}
                          emptyIcon={<StarOutlined sx={{ color: "#CBD5E1" }} />}
                        />
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {calculateMatchScore(selectedApplicant)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Personal Information */}
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
                      Personal Information
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
                        secondary={selectedApplicant.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={selectedApplicant.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedApplicant.phone}
                      />
                    </ListItem>
                  </List>

                  {/* Professional Background */}
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
                      <WorkOutlineOutlined />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Professional Background
                    </Typography>
                  </Box>
                  <List
                    dense
                    sx={{ bgcolor: "grey.50", borderRadius: 2, mb: 3 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <WorkOutlineOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience Level"
                        secondary={selectedApplicant.experienceLevel}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Education"
                        secondary={selectedApplicant.education}
                      />
                    </ListItem>
                  </List>

                  {/* Skills */}
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                    {selectedApplicant.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          borderRadius: 2,
                          bgcolor: "primary.50",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </Box>

                  {/* Cover Letter */}
                  {selectedApplicant.coverLetter && (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                      >
                        Cover Letter
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          p: 2,
                          mb: 3,
                        }}
                      >
                        <Typography variant="body2">
                          {selectedApplicant.coverLetter}
                        </Typography>
                      </Box>
                    </>
                  )}

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
                    {selectedApplicant.resume && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachFileOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Resume/CV" />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedApplicant.resume,
                              "resume"
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
                    {selectedApplicant.portfolio && (
                      <ListItem>
                        <ListItemIcon>
                          <AttachFileOutlined color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Portfolio" />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDownloadDocument(
                              selectedApplicant.portfolio,
                              "portfolio"
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
              {selectedApplicant?.status === "Applied" && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleStatusChange("Rejected");
                    }}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleStatusChange("Shortlisted");
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  >
                    Shortlist
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>

          {/* Confirm Status Change Dialog */}
          <ConfirmDialog
            open={confirmDialog.open}
            title={`${confirmDialog.type} Applicant`}
            message={`Are you sure you want to ${confirmDialog.type.toLowerCase()} ${
              confirmDialog.data?.name
            }'s application?`}
            onConfirm={handleConfirmStatusChange}
            onCancel={() =>
              setConfirmDialog({ open: false, type: "", data: null })
            }
            loading={updateStatusMutation.isPending}
          />

          {/* Calendar Scheduler */}
          <CalendarScheduler
            open={calendarOpen}
            onClose={() => setCalendarOpen(false)}
            applicantId={selectedApplicant?.userId}
            applicantName={selectedApplicant?.name}
            jobId={jobId}
            jobTitle={jobData?.title}
          />
        </Container>
      </Box>
    </Fade>
  );
}
