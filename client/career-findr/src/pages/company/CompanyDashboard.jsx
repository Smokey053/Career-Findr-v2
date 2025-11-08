import React from "react";
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
} from "@mui/material";
import {
  Work,
  People,
  CheckCircle,
  Visibility,
  Add,
  ArrowForward,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../../components/common/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import { getCompanyJobs } from "../../services/jobService";
import { getCompanyJobApplications } from "../../services/applicationService";
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
  const { user } = useAuth();
  const userId = user?.uid;

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
      icon: Work,
      color: "primary",
      action: () => navigate("/company/jobs"),
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: People,
      color: "info",
      action: () => navigate("/company/candidates"),
    },
    {
      title: "New Applications",
      value: pendingApplicants.length,
      icon: Visibility,
      color: "warning",
      action: () => navigate("/company/candidates"),
    },
    {
      title: "Hired This Month",
      value: hiringMetrics.hiredThisMonth,
      icon: CheckCircle,
      color: "success",
      action: () => navigate("/company/candidates"),
    },
  ];

  return (
    <Box className="min-vh-100" bgcolor="background.default">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Welcome back, {user?.name || profile?.companyName || "Company"}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage job postings, review candidates, and track hiring progress
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/company/jobs/new")}
            size="large"
          >
            Post New Job
          </Button>
        </Box>

        {profile && !profile.verified && (
          <Card
            sx={{
              mb: 3,
              bgcolor: "warning.50",
              borderLeft: 4,
              borderColor: "warning.main",
            }}
          >
            <CardContent>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Account Pending Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your company account is under review. You'll be able to post
                jobs once verified by our admin team.
              </Typography>
            </CardContent>
          </Card>
        )}

        <div className="row g-3 mb-4">
          {statsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div className="col-12 col-sm-6 col-lg-3" key={stat.title}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={stat.action}
                >
                  <CardContent>
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
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          fontWeight={700}
                          color={`${stat.color}.main`}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: `${stat.color}.main`,
                          color: "white",
                          p: 1,
                          borderRadius: 2,
                        }}
                      >
                        <Icon />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <Card sx={{ height: "100%" }}>
              <CardContent>
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
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/company/candidates")}
                  >
                    View All
                  </Button>
                </Box>

                {applicantsLoading ? (
                  <Box py={3}>
                    <LinearProgress />
                  </Box>
                ) : recentApplicants.length > 0 ? (
                  <List>
                    {recentApplicants.map((applicant) => {
                      const status = (
                        applicant.status || "pending"
                      ).toLowerCase();
                      const chipColor = statusColorMap[status] || "warning";
                      const name =
                        applicant.studentName || applicant.name || "Applicant";
                      const applicantId =
                        applicant.id || applicant.applicationId;
                      const appliedLabel = applicant.appliedDate
                        ? applicant.appliedDate.toLocaleDateString()
                        : "N/A";

                      return (
                        <ListItem
                          key={applicantId || `${name}-${appliedLabel}`}
                          sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            mb: 1,
                            "&:hover": { bgcolor: "action.hover" },
                            cursor: applicantId ? "pointer" : "default",
                          }}
                          onClick={() =>
                            applicantId
                              ? navigate(`/company/candidates/${applicantId}`)
                              : undefined
                          }
                        >
                          <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
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
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span">
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
                      );
                    })}
                  </List>
                ) : (
                  <Box py={6} textAlign="center">
                    <People
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No applicants yet
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-12 col-lg-5">
            <Card sx={{ height: "100%" }}>
              <CardContent>
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
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/company/jobs")}
                  >
                    Manage
                  </Button>
                </Box>

                {jobsLoading ? (
                  <Box py={3}>
                    <LinearProgress />
                  </Box>
                ) : activeJobs.length > 0 ? (
                  <List>
                    {activeJobs.slice(0, 5).map((job) => {
                      const jobId = job.id || job.jobId;
                      return (
                        <ListItem
                          key={jobId || job.title}
                          sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            mb: 1,
                            "&:hover": { bgcolor: "action.hover" },
                            cursor: jobId ? "pointer" : "default",
                          }}
                          onClick={() =>
                            jobId
                              ? navigate(`/company/jobs/${jobId}`)
                              : undefined
                          }
                        >
                          <Work sx={{ mr: 2, color: "primary.main" }} />
                          <ListItemText
                            primary={job.title}
                            secondary={
                              <>
                                <Typography variant="caption" display="block">
                                  {job.location || "Location"} •{" "}
                                  {job.type || "Type"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="success.main"
                                >
                                  {job.applicantsCount || 0} applicants
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Box py={6} textAlign="center">
                    <Work
                      sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
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
                      sx={{ mt: 2 }}
                      onClick={() => navigate("/company/jobs/new")}
                    >
                      Post Job
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Hiring Metrics
            </Typography>
            <div className="row g-3 mt-2">
              <div className="col-12 col-sm-4">
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    color="primary.main"
                    fontWeight={700}
                  >
                    {hiringMetrics.averageTimeToHire}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Time to Hire (days)
                  </Typography>
                </Box>
              </div>
              <div className="col-12 col-sm-4">
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    color="success.main"
                    fontWeight={700}
                  >
                    {hiringMetrics.totalHired}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hired
                  </Typography>
                </Box>
              </div>
              <div className="col-12 col-sm-4">
                <Box textAlign="center">
                  <Typography
                    variant="h4"
                    color="secondary.main"
                    fontWeight={700}
                  >
                    {hiringMetrics.conversionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Application to Hire Rate
                  </Typography>
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
