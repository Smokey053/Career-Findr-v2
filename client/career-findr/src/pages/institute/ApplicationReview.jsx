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
} from "@mui/material";
import {
  Search,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
  Email,
  School,
  Person,
  AttachFile,
  Download,
  Phone,
  CalendarToday,
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

export default function ApplicationReview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    data: null,
  });

  const statusFilters = [
    "All",
    "pending",
    "under review",
    "approved",
    "rejected",
  ];
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
        status: currentStatus === "All" ? "" : currentStatus,
      }),
  });

  const applications = applicationsData || [];

  // Filter by search query on client side
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
    pending: filteredApplications.filter((a) => a.status === "pending").length,
    underReview: filteredApplications.filter((a) => a.status === "under review")
      .length,
    accepted: filteredApplications.filter((a) => a.status === "approved")
      .length,
    rejected: filteredApplications.filter((a) => a.status === "rejected")
      .length,
  };

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status, reason }) =>
      updateApplicationStatus(applicationId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["instituteApplications"]);
      setConfirmDialog({ open: false, type: "", data: null });
      setAnchorEl(null);
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

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      "Under Review": "info",
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

  if (isLoading) {
    return <LoadingScreen message="Loading applications..." />;
  }

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Application Review
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and manage student applications to your courses
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-2">
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Applications
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "warning.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <Card sx={{ borderTop: 3, borderColor: "info.main" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Under Review
                </Typography>
                <Typography variant="h4" fontWeight={700} color="info.main">
                  {stats.underReview}
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
              placeholder="Search by student name, course, or email..."
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
              {statusFilters.map((status, index) => (
                <Tab key={status} label={status} />
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.response?.data?.message || "Failed to load applications"}
          </Alert>
        )}

        {/* Applications Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Previous Qualification</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <School
                        sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        No applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "primary.main",
                            }}
                          >
                            {application.studentName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {application.studentName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {application.studentEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.courseName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.courseCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(application.appliedDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={application.status}
                          size="small"
                          color={getStatusColor(application.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.previousQualification}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, application)}
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

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewDetails(selectedApplication)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          {selectedApplication?.status !== "Under Review" && (
            <MenuItem onClick={() => handleStatusChange("Under Review")}>
              <ListItemIcon>
                <Email fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mark Under Review</ListItemText>
            </MenuItem>
          )}
          {selectedApplication?.status !== "Accepted" && (
            <MenuItem onClick={() => handleStatusChange("Accepted")}>
              <ListItemIcon>
                <CheckCircle fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Accept Application</ListItemText>
            </MenuItem>
          )}
          {selectedApplication?.status !== "Rejected" && (
            <MenuItem onClick={() => handleStatusChange("Rejected")}>
              <ListItemIcon>
                <Cancel fontSize="small" color="error" />
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
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Application Details
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {selectedApplication && (
              <Box>
                {/* Student Information */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Student Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Name"
                      secondary={`${selectedApplication.firstName} ${selectedApplication.lastName}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={selectedApplication.studentEmail}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={selectedApplication.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={formatDate(selectedApplication.dateOfBirth)}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Educational Background */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Educational Background
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="High School"
                      secondary={selectedApplication.highSchool}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Graduation Year"
                      secondary={selectedApplication.graduationYear}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Previous Qualification"
                      secondary={selectedApplication.previousQualification}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Grades"
                      secondary={selectedApplication.grades}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Personal Statement */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Personal Statement
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Motivation:</strong>
                  <br />
                  {selectedApplication.motivation}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Career Goals:</strong>
                  <br />
                  {selectedApplication.careerGoals}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Documents */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Documents
                </Typography>
                <List dense>
                  {selectedApplication.documents?.transcript && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
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
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                  {selectedApplication.documents?.idCopy && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
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
                      >
                        <Download />
                      </IconButton>
                    </ListItem>
                  )}
                  {selectedApplication.documents?.certificate && (
                    <ListItem>
                      <ListItemIcon>
                        <AttachFile />
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
            {selectedApplication?.status === "Pending" && (
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
                  color="success"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleStatusChange("Accepted");
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
          title={`${confirmDialog.type} Application`}
          message={`Are you sure you want to ${confirmDialog.type.toLowerCase()} this application from ${
            confirmDialog.data?.studentName
          }?`}
          onConfirm={handleConfirmStatusChange}
          onCancel={() =>
            setConfirmDialog({ open: false, type: "", data: null })
          }
          loading={updateStatusMutation.isPending}
        />
      </Container>
    </Box>
  );
}
