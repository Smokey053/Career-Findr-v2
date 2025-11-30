import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Fade,
  Zoom,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  WorkRounded,
  PeopleRounded,
  CheckCircleRounded,
  VisibilityRounded,
  AddRounded,
  ArrowForwardRounded,
  WarningAmberRounded,
  SpeedRounded,
  TrendingUpRounded,
  EmojiEventsRounded,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanyJobs } from "../../services/jobService";
import { getCompanyJobApplications } from "../../services/applicationService";
import { formatDate } from "../../utils/dateUtils";
import { getUser } from "../../services/userService";

const statusColorMap = {
  shortlisted: "info",
  interviewing: "info",
  accepted: "success",
  hired: "success",
  rejected: "error",
  pending: "warning",
  applied: "warning",
};

const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, resendVerificationEmail } = useAuth();
  const userId = user?.uid;
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["companyProfile", userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["companyJobs", userId],
    queryFn: () => getCompanyJobs(userId),
    enabled: !!userId,
  });

  const { data: applicants, isLoading: applicantsLoading } = useQuery({
    queryKey: ["companyApplicants", userId],
    queryFn: () => getCompanyJobApplications(userId),
    enabled: !!userId,
  });

  if (!userId || profileLoading || jobsLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  const jobsList = jobs || [];
  const applicantsList = applicants || [];

  const activeJobs = jobsList.filter((job) => job.status === "active");
  const pendingApplicants = applicantsList.filter(
    (app) => (app.status || "").toLowerCase() === "pending"
  );

  const recentApplicants = applicantsList
    .map((app) => ({
      ...app,
      appliedDate: toDate(app.createdAt) || toDate(app.appliedDate),
    }))
    .sort((a, b) => {
      const aTime = a.appliedDate ? a.appliedDate.getTime() : 0;
      const bTime = b.appliedDate ? b.appliedDate.getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  const totalApplicants = applicantsList.length;
  const hiredStatuses = new Set(["accepted", "hired", "offer accepted"]);

  let totalHireDays = 0;
  let hireCount = 0;

  const hiredApplicants = applicantsList.filter((app) => {
    const status = (app.status || "").toLowerCase();
    return hiredStatuses.has(status);
  });

  hiredApplicants.forEach((app) => {
    const created = toDate(app.createdAt);
    const resolved =
      toDate(app.updatedAt) || toDate(app.hiredAt) || toDate(app.decisionDate);
    if (created && resolved && resolved >= created) {
      const diffMs = resolved.getTime() - created.getTime();
      totalHireDays += diffMs / (1000 * 60 * 60 * 24);
      hireCount += 1;
    }
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const hiresThisMonth = hiredApplicants.filter((app) => {
    const resolved =
      toDate(app.updatedAt) || toDate(app.hiredAt) || toDate(app.decisionDate);
    return resolved && resolved >= startOfMonth;
  }).length;

  const conversionRate = totalApplicants
    ? Math.round((hiredApplicants.length / totalApplicants) * 100)
    : 0;
  const averageTimeToHire = hireCount
    ? Math.round(totalHireDays / hireCount)
    : 0;

  const hiringMetrics = {
    totalHired: hiredApplicants.length,
    hiredThisMonth: hiresThisMonth,
    conversionRate,
    averageTimeToHire,
  };

  const statsData = [
    {
      title: "Active Jobs",
      value: activeJobs.length,
      icon: WorkRounded,
      gradient: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      action: () => navigate("/company/jobs"),
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: PeopleRounded,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      action: () => navigate("/company/candidates"),
    },
    {
      title: "New Applications",
      value: pendingApplicants.length,
      icon: VisibilityRounded,
      gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)",
      action: () => navigate("/company/candidates"),
    },
    {
      title: "Hired This Month",
      value: hiringMetrics.hiredThisMonth,
      icon: CheckCircleRounded,
      gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      action: () => navigate("/company/candidates"),
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section with Animation */}
        <Fade in timeout={600}>
          <Box
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
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
                  <WorkRounded sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  Welcome back,{" "}
                  {user?.name || profile?.companyName || "Company"}!
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pl: 7.5 }}
              >
                Manage job postings, review candidates, and track hiring
                progress
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => navigate("/company/jobs/new")}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Post New Job
            </Button>
          </Box>
        </Fade>

        {/* Email Verification Alert */}
        {user && !user.emailVerified && (
          <Slide in direction="down" timeout={500}>
            <Card
              sx={{
                mb: 3,
                bgcolor: "info.50",
                borderLeft: 4,
                borderColor: "info.main",
                borderRadius: 2,
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
              >
                <WarningAmberRounded
                  color="info"
                  sx={{ fontSize: 28, mt: 0.5 }}
                />
                <Box flex={1}>
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    Verify Your Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please verify your email address to access all features.
                    Check your inbox for a verification link.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={async () => {
                    try {
                      await resendVerificationEmail();
                      setSnackbar({ open: true, message: 'Verification email sent! Check your inbox (and spam folder).', severity: 'success' });
                    } catch (error) {
                      setSnackbar({ open: true, message: error.message || 'Failed to send verification email. Please try again.', severity: 'error' });
                    }
                  }}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                >
                  Resend Email
                </Button>
              </CardContent>
            </Card>
          </Slide>
        )}

        {/* Stats Cards with Staggered Animation */}
        <div className="row g-3 mb-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={stat.title}>
                <Zoom in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
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
                    onClick={stat.action}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ fontWeight: 500 }}
                          >
                            {stat.title}
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

        <div className="row g-3">
          {/* Recent Applicants */}
          <div className="col-12 col-lg-7">
            <Fade in timeout={800}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Recent Applicants
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => navigate("/company/candidates")}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      View All
                    </Button>
                  </Box>

                  {applicantsLoading ? (
                    <Box py={3}>
                      <LinearProgress sx={{ borderRadius: 1 }} />
                    </Box>
                  ) : recentApplicants.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {recentApplicants.map((applicant, index) => {
                        const status = (
                          applicant.status || "pending"
                        ).toLowerCase();
                        const chipColor = statusColorMap[status] || "warning";
                        const name =
                          applicant.studentName ||
                          applicant.name ||
                          "Applicant";
                        const applicantId =
                          applicant.id || applicant.applicationId;
                        const appliedLabel = formatDate(applicant.appliedDate || applicant.createdAt);

                        return (
                          <Slide
                            key={applicantId || `${name}-${appliedLabel}`}
                            in
                            direction="left"
                            timeout={900 + index * 50}
                          >
                            <ListItem
                              sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                mb: 1.5,
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  borderColor: "primary.main",
                                  transform: "translateX(4px)",
                                },
                                cursor: applicantId ? "pointer" : "default",
                              }}
                              onClick={() =>
                                applicantId
                                  ? navigate(
                                      `/company/candidates/${applicantId}`
                                    )
                                  : undefined
                              }
                            >
                              <Avatar
                                sx={{
                                  mr: 2,
                                  background:
                                    "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                                  fontWeight: 600,
                                }}
                              >
                                {name.charAt(0).toUpperCase()}
                              </Avatar>
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                    >
                                      {name}
                                    </Typography>
                                    <Chip
                                      label={applicant.status || "Pending"}
                                      size="small"
                                      color={chipColor}
                                      sx={{
                                        borderRadius: 2,
                                        fontWeight: 500,
                                        textTransform: "capitalize",
                                      }}
                                    />
                                  </Box>
                                }
                                secondary={
                                  <>
                                    <Typography
                                      variant="body2"
                                      component="span"
                                    >
                                      {applicant.jobTitle || "Position"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      color="text.secondary"
                                    >
                                      Applied: {appliedLabel}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </Slide>
                        );
                      })}
                    </List>
                  ) : (
                    <Box py={6} textAlign="center">
                      <PeopleRounded
                        sx={{
                          fontSize: 80,
                          color: "text.disabled",
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        No applicants yet
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>

          {/* Active Job Postings */}
          <div className="col-12 col-lg-5">
            <Fade in timeout={900}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Active Job Postings
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardRounded />}
                      onClick={() => navigate("/company/jobs")}
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "translateX(4px)" },
                      }}
                    >
                      Manage
                    </Button>
                  </Box>

                  {jobsLoading ? (
                    <Box py={3}>
                      <LinearProgress sx={{ borderRadius: 1 }} />
                    </Box>
                  ) : activeJobs.length > 0 ? (
                    <List sx={{ p: 0 }}>
                      {activeJobs.slice(0, 5).map((job, index) => {
                        const jobId = job.id || job.jobId;
                        return (
                          <Slide
                            key={jobId || job.title}
                            in
                            direction="right"
                            timeout={1000 + index * 50}
                          >
                            <ListItem
                              sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2,
                                mb: 1.5,
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                  borderColor: "primary.main",
                                  transform: "translateX(-4px)",
                                },
                                cursor: jobId ? "pointer" : "default",
                              }}
                              onClick={() =>
                                jobId
                                  ? navigate(`/company/jobs/${jobId}`)
                                  : undefined
                              }
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  background:
                                    "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 2,
                                  flexShrink: 0,
                                }}
                              >
                                <WorkRounded
                                  sx={{ color: "white", fontSize: 20 }}
                                />
                              </Box>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                  >
                                    {job.title}
                                  </Typography>
                                }
                                secondary={
                                  <>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                    >
                                      {job.location || "Location"} •{" "}
                                      {job.type || "Type"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "success.main",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {job.applicantsCount || 0} applicants
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </Slide>
                        );
                      })}
                    </List>
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
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        No active jobs
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 2,
                          borderRadius: 2,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                        onClick={() => navigate("/company/jobs/new")}
                      >
                        Post Job
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </div>
        </div>

        {/* Hiring Metrics */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <TrendingUpRounded color="primary" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={600}>
                  Hiring Metrics
                </Typography>
              </Box>
              <div className="row g-3">
                <div className="col-12 col-sm-4">
                  <Zoom in timeout={1100}>
                    <Box
                      textAlign="center"
                      p={3}
                      borderRadius={2}
                      bgcolor="primary.50"
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <SpeedRounded
                        sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                      />
                      <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {hiringMetrics.averageTimeToHire}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Avg. Time to Hire (days)
                      </Typography>
                    </Box>
                  </Zoom>
                </div>
                <div className="col-12 col-sm-4">
                  <Zoom in timeout={1200}>
                    <Box
                      textAlign="center"
                      p={3}
                      borderRadius={2}
                      bgcolor="success.50"
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <EmojiEventsRounded
                        sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                      />
                      <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                          background:
                            "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {hiringMetrics.totalHired}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Total Hired
                      </Typography>
                    </Box>
                  </Zoom>
                </div>
                <div className="col-12 col-sm-4">
                  <Zoom in timeout={1300}>
                    <Box
                      textAlign="center"
                      p={3}
                      borderRadius={2}
                      bgcolor="secondary.50"
                      sx={{
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": { transform: "scale(1.02)" },
                      }}
                    >
                      <TrendingUpRounded
                        sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                      />
                      <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{
                          background:
                            "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {hiringMetrics.conversionRate}%
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Application to Hire Rate
                      </Typography>
                    </Box>
                  </Zoom>
                </div>
              </div>
            </CardContent>
          </Card>
        </Fade>
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
