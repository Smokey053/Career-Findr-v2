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
} from "@mui/material";
import {
  Search,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
  Email,
  Star,
  Person,
  AttachFile,
  Download,
  Phone,
  CalendarToday,
  School,
  Work,
  ArrowBack,
  ThumbUp,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CalendarScheduler from "../../components/common/CalendarScheduler";
import { useAuth } from "../../contexts/AuthContext";
import { getJob } from "../../services/jobService";
import {
  getCompanyJobApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/company/jobs")}
          >
            Back to Jobs
          </Button>
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Applicant Review
            </Typography>
            {jobData && (
              <Typography variant="body1" color="text.secondary">
                {jobData.title} - {jobData.department}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-2">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Applicants
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "grey.400" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Applied
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.applied}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "info.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Shortlisted
                </Typography>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.shortlisted}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "warning.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Interviewing
                </Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.interviewing}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "success.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accepted
                </Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.accepted}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "error.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rejected
                </Typography>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {stats.rejected}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Tabs */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search by applicant name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Tabs */}
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
            >
              {statusFilters.map((status) => (
                <Tab key={status} label={status} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || "Failed to load applicants"}
          </Alert>
        )}

        {/* Applicants Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Match Score</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Skills Match</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Person
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No applicants found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => {
                    const matchScore = calculateMatchScore(applicant);
                    return (
                      <TableRow key={applicant.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "primary.main",
                              }}
                            >
                              {applicant.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {applicant.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {applicant.email}
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
                                />
                              ))}
                            {applicant.skills?.length > 2 && (
                              <Chip
                                label={`+${applicant.skills.length - 2}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, applicant)}
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

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewDetails(selectedApplicant)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
          {selectedApplicant?.status !== "Shortlisted" && (
            <MenuItem onClick={() => handleStatusChange("Shortlisted")}>
              <ListItemIcon>
                <ThumbUp fontSize="small" />
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
            >
              <ListItemIcon>
                <CalendarToday fontSize="small" />
              </ListItemIcon>
              <ListItemText>Schedule Interview</ListItemText>
            </MenuItem>
          )}
          {selectedApplicant?.status !== "Accepted" && (
            <MenuItem onClick={() => handleStatusChange("Accepted")}>
              <ListItemIcon>
                <CheckCircle fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Accept</ListItemText>
            </MenuItem>
          )}
          {selectedApplicant?.status !== "Rejected" && (
            <MenuItem onClick={() => handleStatusChange("Rejected")}>
              <ListItemIcon>
                <Cancel fontSize="small" color="error" />
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
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Applicant Profile
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedApplicant && (
              <Box>
                {/* Match Score */}
                <Card sx={{ mb: 3, bgcolor: "primary.50" }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Match Score
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Rating
                        value={calculateMatchScore(selectedApplicant) / 20}
                        readOnly
                        precision={0.5}
                      />
                      <Typography variant="h5" fontWeight={700}>
                        {calculateMatchScore(selectedApplicant)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Name"
                      secondary={selectedApplicant.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={selectedApplicant.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={selectedApplicant.phone}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Professional Background */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Professional Background
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Work />
                    </ListItemIcon>
                    <ListItemText
                      primary="Experience Level"
                      secondary={selectedApplicant.experienceLevel}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <School />
                    </ListItemIcon>
                    <ListItemText
                      primary="Education"
                      secondary={selectedApplicant.education}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Skills */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Skills
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {selectedApplicant.skills?.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

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
                    <Typography variant="body2" paragraph>
                      {selectedApplicant.coverLetter}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {/* Documents */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Documents
                </Typography>
                <List dense>
                  {selectedApplicant.resume && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
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
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                  {selectedApplicant.portfolio && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
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
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            {selectedApplicant?.status === "Applied" && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleStatusChange("Rejected");
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleStatusChange("Shortlisted");
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
  );
}
