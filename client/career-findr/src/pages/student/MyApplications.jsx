import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  Alert,
} from "@mui/material";
import {
  VisibilityRounded,
  DeleteRounded,
  CheckCircleRounded,
  CancelRounded,
  PendingRounded,
  DownloadRounded,
  DescriptionRounded,
  CelebrationRounded,
  SchoolRounded,
  WorkRounded,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentAPI } from "../../services/api";
import LoadingScreen from "../../components/common/LoadingScreen";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import {
  getStudentApplications,
  getStudentJobApplications,
  getStudentAdmissions,
  acceptAdmission,
  declineAdmission,
  withdrawApplication,
} from "../../services/applicationService";
import { formatDate } from "../../utils/dateUtils";

export default function MyApplications() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, type: null });

  // Fetch course applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ["studentApplications"],
    queryFn: () => getStudentApplications(user.uid),
  });

  // Fetch job applications
  const { data: jobApplications, isLoading: jobAppsLoading } = useQuery({
    queryKey: ["studentJobApplications"],
    queryFn: () => getStudentJobApplications(user.uid),
  });

  // Fetch admissions
  const { data: admissions } = useQuery({
    queryKey: ["studentAdmissions"],
    queryFn: () => getStudentAdmissions(user.uid),
  });

  // Accept admission mutation
  const acceptAdmissionMutation = useMutation({
    mutationFn: (admissionId) => acceptAdmission(admissionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentAdmissions"]);
    },
  });

  // Decline admission mutation
  const declineAdmissionMutation = useMutation({
    mutationFn: (admissionId) => declineAdmission(admissionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentAdmissions"]);
    },
  });

  // Withdraw application mutation
  const withdrawMutation = useMutation({
    mutationFn: (applicationId) => withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentApplications"]);
      queryClient.invalidateQueries(["studentJobApplications"]);
      setDeleteDialog({ open: false, id: null, type: null });
    },
  });

  const handleWithdraw = (applicationId, type) => {
    setDeleteDialog({ open: true, id: applicationId, type });
  };

  const confirmWithdraw = () => {
    if (deleteDialog.id) {
      withdrawMutation.mutate(deleteDialog.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircleRounded sx={{ fontSize: 18 }} />;
      case "rejected":
        return <CancelRounded sx={{ fontSize: 18 }} />;
      case "pending":
        return <PendingRounded sx={{ fontSize: 18 }} />;
      default:
        return null;
    }
  };

  if (isLoading || jobAppsLoading) {
    return <LoadingScreen message="Loading applications..." />;
  }

  const courseApplications = applications || [];
  const jobApps = jobApplications || [];
  const pendingAdmissions =
    admissions?.filter((adm) => adm.status === "pending") || [];
  const acceptedAdmission = admissions?.find((adm) => adm.status === "accepted");
  const hasAcceptedAdmission = !!acceptedAdmission;

  const summaryStats = [
    {
      label: "Course Applications",
      value: courseApplications.length,
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      icon: DescriptionRounded,
    },
    {
      label: "Job Applications",
      value: jobApps.length,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      icon: WorkRounded,
    },
    {
      label: "Pending",
      value: courseApplications.filter((app) => app.status === "pending").length +
             jobApps.filter((app) => app.status === "pending").length,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)",
      icon: PendingRounded,
    },
    {
      label: "Admission Offers",
      value: pendingAdmissions.length,
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)",
      icon: CelebrationRounded,
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header with Animation */}
        <Fade in timeout={600}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                <DescriptionRounded sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                My Applications
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ pl: 7.5 }}>
              Track your course applications and manage admission offers
            </Typography>
          </Box>
        </Fade>

        {/* Summary Cards with Staggered Animation */}
        <div className="row g-3 mb-4">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={stat.label}>
                <Zoom in timeout={500 + index * 100}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: stat.gradient,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {stat.label}
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                              background: stat.gradient,
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            background: stat.gradient,
                            color: "white",
                            p: 1.5,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        >
                          <Icon sx={{ fontSize: 24 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <Fade in timeout={800}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              <Tab label="Course Applications" />
              <Tab 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Job Applications
                    {jobApps.length > 0 && (
                      <Chip
                        label={jobApps.length}
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    Admission Offers
                    {pendingAdmissions.length > 0 && (
                      <Chip
                        label={pendingAdmissions.length}
                        size="small"
                        color="success"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                }
              />
            </Tabs>

            {/* Course Applications Tab */}
            {tabValue === 0 && (
              <CardContent sx={{ p: 3 }}>
                {courseApplications.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Institution
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Applied Date
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {courseApplications.map((app, index) => (
                          <Slide
                            key={app.id}
                            in
                            direction="left"
                            timeout={600 + index * 50}
                          >
                            <TableRow
                              hover
                              sx={{
                                transition:
                                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  transform: "scale(1.005)",
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {app.courseName || "Course Name"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {app.courseField || "Field"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {app.institutionName || app.instituteName || "Institution"}
                              </TableCell>
                              <TableCell>
                                {formatDate(app.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getStatusIcon(app.status)}
                                  label={app.status}
                                  size="small"
                                  color={getStatusColor(app.status)}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Details" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/courses/${app.courseId}`)}
                                    sx={{
                                      transition:
                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {app.documents && (
                                  <Tooltip title="Download Documents" arrow>
                                    <IconButton
                                      size="small"
                                      color="info"
                                      sx={{
                                        transition:
                                          "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": { transform: "scale(1.15)" },
                                      }}
                                    >
                                      <DownloadRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {app.status === "pending" && (
                                  <Tooltip title="Withdraw Application" arrow>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleWithdraw(app.id, "course")}
                                      sx={{
                                        transition:
                                          "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": { transform: "scale(1.15)" },
                                      }}
                                    >
                                      <DeleteRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box py={6} textAlign="center">
                    <PendingRounded
                      sx={{
                        fontSize: 80,
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
                      No applications yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Start browsing courses to submit your first application
                    </Typography>
                    <Button
                      variant="contained"
                      href="/courses"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      Browse Courses
                    </Button>
                  </Box>
                )}
              </CardContent>
            )}

            {/* Job Applications Tab */}
            {tabValue === 1 && (
              <CardContent sx={{ p: 3 }}>
                {jobApps.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Applied Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobApps.map((app, index) => (
                          <Slide
                            key={app.id}
                            in
                            direction="left"
                            timeout={600 + index * 50}
                          >
                            <TableRow
                              hover
                              sx={{
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  transform: "scale(1.005)",
                                },
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {app.jobTitle || "Job Title"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {app.companyName || "Company"}
                              </TableCell>
                              <TableCell>
                                {formatDate(app.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  icon={getStatusIcon(app.status)}
                                  label={app.status}
                                  size="small"
                                  color={getStatusColor(app.status)}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                  }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Job" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => navigate(`/jobs/${app.jobId}`)}
                                    sx={{
                                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": { transform: "scale(1.15)" },
                                    }}
                                  >
                                    <VisibilityRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {app.resumeUrl && (
                                  <Tooltip title="View Resume" arrow>
                                    <IconButton
                                      size="small"
                                      color="info"
                                      onClick={() => window.open(app.resumeUrl, "_blank")}
                                      sx={{
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": { transform: "scale(1.15)" },
                                      }}
                                    >
                                      <DownloadRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {app.status === "pending" && (
                                  <Tooltip title="Withdraw Application" arrow>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleWithdraw(app.id, "job")}
                                      sx={{
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": { transform: "scale(1.15)" },
                                      }}
                                    >
                                      <DeleteRounded fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          </Slide>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box py={6} textAlign="center">
                    <WorkRounded
                      sx={{
                        fontSize: 80,
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
                      No job applications yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Start browsing jobs to submit your first application
                    </Typography>
                    <Button
                      variant="contained"
                      href="/jobs"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      Browse Jobs
                    </Button>
                  </Box>
                )}
              </CardContent>
            )}

            {/* Admission Offers Tab */}
            {tabValue === 2 && (
              <CardContent sx={{ p: 3 }}>
                {/* Show accepted admission if exists */}
                {acceptedAdmission && (
                  <Alert 
                    severity="success" 
                    icon={<CheckCircleRounded />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      You have accepted an admission offer!
                    </Typography>
                    <Typography variant="body2">
                      Course: {acceptedAdmission.courseName || "Course"} at {acceptedAdmission.institutionName || acceptedAdmission.instituteName || "Institution"}
                    </Typography>
                  </Alert>
                )}
                
                {pendingAdmissions.length > 0 ? (
                  <div className="row g-3">
                    {pendingAdmissions.map((admission, index) => (
                      <div className="col-12 col-md-6" key={admission.id}>
                        <Zoom in timeout={500 + index * 100}>
                          <Card
                            variant="outlined"
                            sx={{
                              height: "100%",
                              borderRadius: 3,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              border: "2px solid",
                              borderColor: hasAcceptedAdmission ? "grey.300" : "success.light",
                              opacity: hasAcceptedAdmission ? 0.7 : 1,
                              "&:hover": {
                                transform: hasAcceptedAdmission ? "none" : "translateY(-4px)",
                                boxShadow: hasAcceptedAdmission 
                                  ? "none"
                                  : "0 12px 24px rgba(16, 185, 129, 0.15)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="start"
                                mb={2}
                              >
                                <Box
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 2,
                                    background:
                                      "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow:
                                      "0 4px 12px rgba(16, 185, 129, 0.3)",
                                  }}
                                >
                                  <CelebrationRounded
                                    sx={{ color: "white", fontSize: 28 }}
                                  />
                                </Box>
                                <Chip
                                  icon={
                                    <CheckCircleRounded sx={{ fontSize: 16 }} />
                                  }
                                  label="Admission Offer"
                                  color="success"
                                  size="small"
                                  sx={{ borderRadius: 2, fontWeight: 500 }}
                                />
                              </Box>

                              <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                              >
                                {admission.courseName || "Course Name"}
                              </Typography>

                              <Typography
                                variant="body2"
                                gutterBottom
                                fontWeight={600}
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                {admission.institutionName || admission.instituteName || "Institution"}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                paragraph
                              >
                                {admission.message ||
                                  "Congratulations! You have been accepted."}
                              </Typography>

                              {admission.deadline && (
                                <Chip
                                  label={`Respond by: ${formatDate(admission.deadline)}`}
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{ borderRadius: 2, mb: 2 }}
                                />
                              )}

                              {hasAcceptedAdmission && (
                                <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                                  You have already accepted an admission. Only one course can be accepted.
                                </Alert>
                              )}

                              <Box display="flex" gap={1} mt={2}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  fullWidth
                                  onClick={() =>
                                    acceptAdmissionMutation.mutate(admission.id)
                                  }
                                  disabled={acceptAdmissionMutation.isPending || hasAcceptedAdmission}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover:not(:disabled)": {
                                      transform: "translateY(-2px)",
                                      boxShadow:
                                        "0 4px 12px rgba(16, 185, 129, 0.3)",
                                    },
                                  }}
                                >
                                  Accept Offer
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  fullWidth
                                  onClick={() =>
                                    declineAdmissionMutation.mutate(
                                      admission.id
                                    )
                                  }
                                  disabled={declineAdmissionMutation.isPending}
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover:not(:disabled)": {
                                      transform: "translateY(-2px)",
                                    },
                                  }}
                                >
                                  Decline
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Zoom>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Box py={6} textAlign="center">
                    <SchoolRounded
                      sx={{
                        fontSize: 80,
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
                      No admission offers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admission offers will appear here when institutions accept
                      your applications
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}
          </Card>
        </Fade>

        {/* Withdraw Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Withdraw Application"
          message={`Are you sure you want to withdraw this ${deleteDialog.type === "job" ? "job" : "course"} application? This action cannot be undone.`}
          onConfirm={confirmWithdraw}
          onCancel={() => setDeleteDialog({ open: false, id: null, type: null })}
          loading={withdrawMutation.isPending}
          confirmText="Withdraw"
          confirmColor="error"
        />
      </Container>
    </Box>
  );
}
